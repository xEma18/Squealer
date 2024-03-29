import { createRouter, createWebHistory } from 'vue-router';
import homePage from '../components/homePage.vue';
import writeSqueal from '../components/writeSqueal.vue';

const routes = [
  {
    path: '/SMM/', // per navigare a una nuova rotta: this.$router.push({ path: '/nuovaPagina', query: { chiave: 'valore' } });
    name: 'homepage', // posso sfruttare anche il name per navigare: this.$router.push({ name: 'nuovaPagina', query: { chiave: 'valore' } });
    component: homePage
  },
  {
    path: '/SMM/writeSqueal',
    name: 'writeSqueal',
    component: writeSqueal
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
