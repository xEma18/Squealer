<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const squeals = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch('http://localhost:3001/squealsToUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'nome_utente' }) 
        });
        if (!response.ok) {
          throw new Error('Errore nel caricamento dei squeals');
        }
        const data = await response.json();
        squeals.value = data;
      } catch (error) {
        console.error('Errore:', error);
      }
    });

    return { squeals };
  }
}
</script>
