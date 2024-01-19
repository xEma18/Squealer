import { createApp } from 'vue';
import PostMessage from './components/PostMessage.vue';
import SelectVip from './components/SelectVip.vue';
import App from './App.vue';

const app = createApp(App);
app.component('post-message', PostMessage);
app.component('select-vip', SelectVip);
app.mount('#app');
