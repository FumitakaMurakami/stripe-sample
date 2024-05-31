<template>
  <div>
    <button @click="handleCheckout('price_free')">Free Plan</button>
    <button @click="handleCheckout('price_1PM4EOHrrQRw4jt1g1A1IGP8')">Standard Plan</button>
    <button @click="handleCheckout('price_1PM5U8HrrQRw4jt1GQpUtWaK')">Enterprise Plan</button>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  methods: {
    async handleCheckout(priceId) {
      try {
        const response = await fetch('http://localhost:3000/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ priceId })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const session = await response.json();
        const stripe = await loadStripe('pk_test_51PM24hHrrQRw4jt1qKGtWcsiX7ykdNRUT8c5vtqTUoN60xbwlo54ffWp5xYyRaoQmPgfl2bV5SHF3MI7a6XrnMhG00ElDe5Ie8');
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) {
          console.error('Error:', error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>