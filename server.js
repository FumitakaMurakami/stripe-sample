require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

app.use(bodyParser.json());

// CORS設定
const allowedOrigins = ['http://localhost:6235', 'http://172.20.10.5:6235'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json({ message: "Login successful", userId: row.id });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.get('/plans', (req, res) => {
  db.all("SELECT * FROM plans", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ plans: rows });
  });
});

app.post('/create-checkout-session', async (req, res) => {
  const { priceId, userId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `http://localhost:6235/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&price_id=${priceId}`,
    cancel_url: 'http://localhost:6235/cancel',
  });

  res.json({ id: session.id });
});

// プラン変更エンドポイントの追加
app.post('/change-plan', (req, res) => {
  const { userId, priceId } = req.body;

  db.get("SELECT id FROM plans WHERE price_id = ?", [priceId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ error: "Invalid price ID" });
    }

    const planId = row.id;
    db.run("UPDATE users SET plan_id = ? WHERE id = ?", [planId, userId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Plan updated successfully" });
    });
  });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(row);
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));