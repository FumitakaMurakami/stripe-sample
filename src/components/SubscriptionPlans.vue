<template>
  <div>
    <h2>プラン変更</h2>
    <div v-if="userPriceId">
      <p>現在のプラン: {{ userPriceId }}</p>
    </div>
    <div v-for="plan in plans" :key="plan.id">
      <button @click="handleCheckout(plan.price_id, plan.id)">{{ plan.name }}</button>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'SubscriptionPlans',
  data() {
    return {
      plans: [],
      userPriceId: ''
    };
  },
  async created() {
    try {
      const response = await fetch('http://localhost:3000/plans');
      const data = await response.json();
      this.plans = data.plans;
      
      const userId = this.$route.params.userId;
      const userResponse = await fetch(`http://localhost:3000/user/${userId}`);
      const userData = await userResponse.json();
      this.userPriceId = userData.plan_id;
      console.log(userData);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  },
  methods: {
    async handleCheckout(priceId) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (priceId === 'price_free') {
          const response = await fetch('http://localhost:3000/change-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id, priceId })
          });

          if (!response.ok) {
            throw new Error('Failed to update plan');
          }

          const data = await response.json();
          alert(data.message);
          const planResponse = await fetch('http://localhost:3000/plans');
          const planData = await planResponse.json();
          this.plans = planData.plans;
          
          const userId = this.$route.params.userId;
          const userResponse = await fetch(`http://localhost:3000/user/${userId}`);
          const userData = await userResponse.json();
          this.userPriceId = userData.plan_id;
        } else {
          const response = await fetch('http://localhost:3000/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ priceId, userId: user.id })
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const session = await response.json();
          const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);
          const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
          if (error) {
            console.error('Error:', error);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
};
</script>