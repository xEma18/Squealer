<template>
    <section class="section">
      <div class="container">
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item button is-white" @click="navigateToFeed">
              <span class="icon"><i class="fas fa-times"></i></span>
            </a>
          </div>
          <div class="level-right">
            <button class="level-item button is-white" @click="handlePostSqueal">Squeal</button>
          </div>
        </nav>
  
        <div class="columns">
          <div class="column is-2">
            <figure class="image is-64x64">
              <img :src="userData.image" alt="Profile Picture" class="is-rounded">
            </figure>
          </div>
          <div class="column is-10">
            <!-- Contenuto del post (testo, immagine o mappa) -->
            <div v-if="image" class="image-container">
              <img :src="image" alt="Uploaded">
            </div>
            <div v-else-if="showMap" ref="mapRef" class="map-container"></div>
            <div v-else class="textarea-container">
              <textarea class="textarea" placeholder="Squeal about it!" v-model="text"></textarea>
            </div>
          </div>
        </div>
  
        <div class="media-controls">
          <div class="control">
            <label class="label">
              <input id="fileInput" type="file" accept="image/*" @change="handleImageChange" hidden>
              <span class="icon" @click="triggerFileInput"><i class="fas fa-image"></i></span>
            </label>
          </div>
          <div class="control">
            <span class="icon"><i class="fas fa-video"></i></span>
          </div>
          <div class="control">
            <span class="icon" @click="handleLocationClick"><i class="fas fa-location-dot"></i></span>
          </div>
        </div>
  
        <div v-if="publicMode" class="char-interface box">
    <h3 class="title is-6">Character Count</h3>
    <div class="char-count">
      <p>Daily characters used <span>{{ dailyCharsUsed }}/{{ dailyCharLimit }}</span></p>
      <progress class="progress is-small is-primary" :value="dailyCharsUsed" :max="dailyCharLimit"></progress>
      <p>Weekly characters used <span>{{ weeklyCharsUsed }}/{{ weeklyCharLimit }}</span></p>
      <progress class="progress is-small is-link" :value="weeklyCharsUsed" :max="weeklyCharLimit"></progress>
      <p>Monthly characters used <span>{{ monthlyCharsUsed }}/{{ monthlyCharLimit }}</span></p>
      <progress class="progress is-small is-info" :value="monthlyCharsUsed" :max="monthlyCharLimit"></progress>
    </div>
    <button class="button is-small is-warning">Not enough? Buy it!</button>
  </div>
  
        <div class="content">
          <h2 class="subtitle">Who is it for?</h2>
          <p>Add your recipients, each one separated by a space.</p>
          <textarea class="textarea" id="recipients-list" placeholder="@foo §foo §BAR" v-model="recipientsText" @input="handleRecipientsChange"></textarea>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userData: {}, // Dati utente
        text: '', // Testo inserito dall'utente
        image: '', // Immagine inserita dall'utente
        recipientsText: '', // Testo dei destinatari
        recipients: [], // Array di destinatari
        showMap: false, // Mostra mappa
        mapInfo: { lat: null, lng: null, zoom: 13 }, // Informazioni mappa
        publicMode: false, // Modalità pubblica
        dailyCharsUsed: 908,
        weeklyCharsUsed: 1883,
        monthlyCharsUsed: 2483,
        dailyCharLimit: 4009,
        weeklyCharLimit: 1400,
        monthlyCharLimit: 5600,
      };
    },
    methods: {
      navigateToFeed() {
        this.$router.push('/');
      },
      handlePostSqueal() {
        // Gestione invio post
      },
      triggerFileInput() {
      this.$refs.fileInput.click(); // Questo triggererà l'input del file nascosto
    },
    handleImageChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result; // Imposta l'immagine come base64
          this.text = ''; // Pulisce la textarea quando viene caricata un'immagine
        };
        reader.readAsDataURL(file);
      }
    },
      handleLocationClick() {
        // Gestione click sulla localizzazione
      },
      handleRecipientsChange() {
        this.recipients = this.recipientsText.split(' ').filter(r => r !== '');
        this.publicMode = this.recipients.some(recipient => 
          recipient === "@everyone" || recipient.startsWith("§")
        );
      },
      
    },
    mounted() {
      // Inizializzazione componenti, come nel useEffect di React
    }
  };
  </script>
  
  <style>
.image-container img, .map-container {
  max-width: 80%;
  max-height: 165px;
  margin: 0 auto;
}

.media-controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.media-controls .icon {
  color: #3273dc;
  cursor: pointer;
}

.char-interface {
  background-color: #ffffff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 5px;
}

.char-interface .char-count p {
  color: #363636;
  font-size: 0.9rem;
}

.char-interface .char-count span {
  font-weight: bold;
  color: #5B3C1D; /* Metallic Bronze */

}

.progress {
  margin-bottom: 0.5rem;
  
}

.progress.is-primary {
  background-color: #DBB77C; /* Tumbleweed*/
}



.section {
  background-color: #f4f4f4; 
}

.button.is-warning {
  background-color: #DBB77C; /* Tumbleweed */
  color: #5B3C1D; /* Metallic Bronze */
}
.level-item.button.is-white, .button.is-warning {
  transition: all 0.3s ease;
  background-color: #DBB77C; /* Tumbleweed */
  color: #5B3C1D; /* Metallic Bronze */
  border-color: #DBB77C; /* Tumbleweed */
}

.level-item.button.is-white:hover {
  background-color: #c19a6b; /* Tumbleweed più scuro */
  color: #ffffff; /* Bianco per il testo al hover */
}

.button.is-warning:hover {
  background-color: #c19a6b; /* Tumbleweed più scuro */
}

.textarea, .image-container img, .map-container, .char-interface {
  box-shadow: 0 2px 5px rgba(91, 60, 29, 0.2); 
  border: 1px solid #9a9a9a; 
}

.level-item.button.is-white:hover, .button.is-warning:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}


.textarea, .image-container img, .map-container {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.media-controls .icon:hover {
  color: #3c2e1e; 
}

.media-controls .icon {
  color: #5B3C1D; 
}


.subtitle {
  color: #DBB77C; 
  margin-bottom: 1rem;
}

p {
  color: #4a4a4a; 
}

/* Stili specifici per desktop */
@media screen and (min-width: 1024px) {
  .section {
    padding: 3rem 10rem;
  }

  .char-interface {
    margin-bottom: 2rem;
  }
}

</style>
  