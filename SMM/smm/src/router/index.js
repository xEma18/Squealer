import { createRouter, createWebHistory } from 'vue-router';
import postMessage from '../components/postMessage.vue';
import Feed from '../components/Feed.vue';

const routes = [
  {
    path: '/', // per navigare a una nuova rotta: this.$router.push({ path: '/nuovaPagina', query: { chiave: 'valore' } });
    name: 'feed', // posso sfruttare anche il name per navigare: this.$router.push({ name: 'nuovaPagina', query: { chiave: 'valore' } });
    component: Feed
  },
  {
    path: '/postMessage',
    name: 'postMessage',
    component: postMessage
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
