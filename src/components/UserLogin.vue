<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label for="username">ユーザーID:</label>
      <input type="text" v-model="username" required>
      <label for="password">パスワード:</label>
      <input type="password" v-model="password" required>
      <button type="submit">ログイン</button>
    </form>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: this.username, password: this.password })
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        this.$router.push({ name: 'SubscriptionPlans', params: { userId: data.userId } });
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>