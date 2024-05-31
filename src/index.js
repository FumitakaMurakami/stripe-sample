import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../components/UserLogin.vue';
import SubscriptionPlans from '../components/SubscriptionPlans.vue';
import PaymentSuccess from '../components/PaymentSuccess.vue';

const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/plans/:userId',
    name: 'SubscriptionPlans',
    component: SubscriptionPlans
  },
  {
    path: '/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;