<template>
    <div class="field">
      <label class="label">Messaggio</label>
      <div class="control">
        <textarea class="textarea" placeholder="Scrivi qui il tuo squeal..." v-model="message"></textarea>
      </div>
      <p>Caratteri Rimanenti: {{ charLimit - message.length }}</p>
      <button class="button is-link" @click="postSqueal">Posta Squeal</button>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        message: '',
        charLimit: 280, // Ad esempio, limite di 280 caratteri
      };
    },
    methods: {
      postSqueal() {
        // Implementa la logica per inviare il messaggio
        console.log("Messaggio inviato:", this.message);
      }
    }
  };
  </script>
  