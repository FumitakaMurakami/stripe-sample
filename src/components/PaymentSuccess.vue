<template>
  <div>
    <h2>決済完了</h2>
    <p>プランが変更されました</p>
    <button @click="goToPlans">プラン選択画面へ戻る</button>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccess',
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
    const priceId = urlParams.get('price_id');

    if (userId && priceId) {
      try {
        const response = await fetch('http://localhost:3000/change-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, priceId })
        });

        if (!response.ok) {
          throw new Error('Failed to update plan');
        }

        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  },
  methods: {
    goToPlans() {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('user_id');
      this.$router.push({ name: 'SubscriptionPlans', params: { userId } });
    }
  }
};
</script>