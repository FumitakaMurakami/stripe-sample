const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config(); // 環境変数を読み込む

// データベースファイルのパスを設定
const dbPath = path.resolve(__dirname, './db/database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // プランテーブルの作成
  db.run(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price_id TEXT
  )`);

  // ユーザーテーブルの作成
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    plan_id INTEGER,
    FOREIGN KEY(plan_id) REFERENCES plans(id)
  )`);

  // 初期データの挿入（存在しない場合のみ）
  db.get("SELECT COUNT(*) AS count FROM plans", (err, row) => {
    if (row.count === 0) {
      const planStmt = db.prepare("INSERT INTO plans (name, price_id) VALUES (?, ?)");
      planStmt.run("Free Plan", process.env.FREE_PLAN_PRICE_ID);
      planStmt.run("Standard Plan", process.env.STANDARD_PLAN_PRICE_ID);
      planStmt.run("Enterprise Plan", process.env.ENTERPRISE_PLAN_PRICE_ID);
      planStmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (row.count === 0) {
      const userStmt = db.prepare("INSERT INTO users (username, password, plan_id) VALUES (?, ?, ?)");
      userStmt.run("user1", "password1", 1); // Free Planに設定
      userStmt.finalize();
    }
  });
});

module.exports = db;