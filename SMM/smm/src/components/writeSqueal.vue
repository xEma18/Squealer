<template>
    <section class="section">
      <div class="container">
        <nav class="level is-mobile">
          <div class="level-left ">
            <a class="level-item button is-white is-rounded" @click="navigateToFeed">
              <span class="icon"><i class="fas fa-times"></i></span>
            </a>
          </div>
          <div class="level-right">
            <button class="level-item button is-white is-rounded" @click="handlePostSqueal">Squeal</button>
          </div>
        </nav>
  
        <div class="columns squeal-about-it">
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
              <textarea class="textarea" placeholder="Squeal about it!" v-model="text" @input="updateCharacterCount" :maxlength="maxLength"></textarea>
            </div>
          </div>
        </div>
  
        <div class="media-controls">
          <div class="control">
            <label class="label">
              <input id="fileInput" type="file" accept="image/*" @change="handleImageChange" hidden>
              <span class="icon"><i class="fas fa-image"></i></span>
            </label>
          </div>
          <div class="control">
            <label class="label">
              <input id="fileInput" type="file" accept="video/*" @change="handleImageChange" hidden>
              <span class="icon"><i class="fas fa-video"></i></span>
            </label>
          </div>
          <div class="control">
            <span class="icon" @click="handleLocationClick"><i class="fas fa-map-marker-alt"></i></span>

          </div>
          <div class="control">
            <span class="icon" @click="handleRandomNews"><i class="fas fa-newspaper"></i></span>
          </div>
          <div class="control">
            <span class="icon" @click="handleRandomImage"><i class="fas fa-images"></i></span>
          </div>
        </div>
        
        
        

        <div v-if="publicMode" class="characterCounterContainer">
          <character-count :daily-chars-used="dailyCharsUsed"
                            :weekly-chars-used="weeklyCharsUsed"
                            :monthly-chars-used="monthlyCharsUsed"
                            :daily-char-limit="dailyCharLimit"
                            :weekly-char-limit="weeklyCharLimit"
                            :monthly-char-limit="monthlyCharLimit">
          </character-count>
        </div>
        
        <div v-else class="characterCounterContainer">
          <div class="char-interface box">
            <h3 class="title is-5">Characters Counter: Private Mode</h3>
            <div class="char-count">
              <p>Daily characters: UNLIMITED</p>
              <progress class="progress is-small is-info" max="100" id="indeterminate-progress"></progress>
              <p>Weekly characters: UNLIMITED</p>
              <progress class="progress is-small is-primary" max="100" id="indeterminate-progress"></progress>
              <p>Monthly characters: UNLIMITED</p>
              <progress class="progress is-small is-primary" max="100" id="indeterminate-progress"></progress>
            </div>
          </div>
        </div>
  
        <div class="content">
          <h2 class="subtitle">Who is it for?</h2>
          <p>Add your recipients, each one separated by a space.</p>
          <textarea class="textarea" id="recipients-list" placeholder="@foo §foo @everyone" v-model="recipientsText" @input="handleRecipientsChange"></textarea>
        </div>

        <div class="automaticMessages">
          <div id="temporizzato" class="level-item button is-white is-rounded" :style="{ color: 'black', border: `2px solid ${isTemporizzato ? 'green' : 'red'}` }" @click="toggleTemporizzato">Send Timed Message</div>
            <div v-if="isTemporizzato" id="repetition-parameters">
              <p>Send</p>
              <input class="input-temp" type="number" v-model="numeroInvii" placeholder="" />
              <p class="middleP"> times</p> <p> every </p>
              <input class="input-temp" type="number" v-model="intervalloInvio" placeholder="" />
              <p>min</p>
            </div>
          </div>

      </div>
    </section>
  </template>
  

  <script>
  import CharacterCount from './charactersCounter.vue';

  export default {
    components: {
      CharacterCount
    },
    data() {
      return {
        userData: {}, // Dati utente
        text: '', 
        image: '', 
        recipientsText: '', 
        recipients: [], 
        showMap: false, // Mostra mappa
        mapInfo: { lat: null, lng: null, zoom: 13 }, // Informazioni mappa
        publicMode: false, 

        userData: {
        caratteriGiornalieriUsati: 100, // Numero di caratteri giornalieri già usati
        caratteriSettimanaliUsati: 700, // Numero di caratteri settimanali già usati
        caratteriMensiliUsati: 1400, // Numero di caratteri mensili già usati
      },
        dailyCharsUsed: 100,
        weeklyCharsUsed: 700,
        monthlyCharsUsed: 1400,
        dailyCharLimit: 200,
        weeklyCharLimit: 2800,
        monthlyCharLimit: 11200,
        isTemporizzato: false,
        numeroInvii: 1,
        intervalloInvio: 1,

      };
    },
    methods: {
      navigateToFeed() {
        this.$router.push('/SMM/');
      },
      handlePostSqueal() {
        // Gestione invio post: devo aspettare di avere dalla homepage i dati utente
      },
      updateCharacterCount() {
        const textLength = this.text.length;
        
        // Aggiorna i contatori dei caratteri
        this.dailyCharsUsed = this.userData.caratteriGiornalieriUsati + textLength;
        this.weeklyCharsUsed = this.userData.caratteriSettimanaliUsati + textLength;
        this.monthlyCharsUsed = this.userData.caratteriMensiliUsati + textLength;
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
      handleRandomNews() {
        // Gestione click su notizia casuale
      },
      handleRandomImage() {
        // Gestione click su immagine casuale
      },
      toggleTemporizzato() {
        this.isTemporizzato = !this.isTemporizzato;
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
    },
    computed:{
      maxLength() {
        const remainingDailyChars = this.dailyCharLimit - this.userData.caratteriGiornalieriUsati;
        const remainingWeeklyChars = this.weeklyCharLimit - this.userData.caratteriSettimanaliUsati;
        const remainingMonthlyChars = this.monthlyCharLimit - this.userData.caratteriMensiliUsati;

        return Math.min(remainingDailyChars, remainingWeeklyChars, remainingMonthlyChars);
  }
    }
  };
  
  </script>
  
  <style>
#indeterminate-progress {
  background-image: linear-gradient(to right, #08d4b4 20%, #f4f4f4 40%, #08d4b4 60%);
  background-size: 200% 100%;
  animation: indeterminateProgress 2s linear infinite;
}

@keyframes indeterminateProgress {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.squeal-about-it {
  margin-top: 4%;
}

.characterCounterContainer {
  margin-top: 3%;
  margin-bottom: 3%;
}

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

.section {
  background-color: #f4f4f4; 
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

.textarea, .image-container img, .map-container {
  box-shadow: 0 2px 5px rgba(91, 60, 29, 0.2); 
  border: 1px solid #9a9a9a; 
}

.level-item.button.is-white:hover {
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
#repetition-parameters {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 2.5rem;
  justify-content: center;
}

.input-temp {
  border: 1px solid #949797;
  border-radius: 9999px;
  padding: 0.3rem 1rem;
  font-size: 1rem;
  color: #333;
  outline: none;
  width: 10%;
  height: 10%;
  margin-top: 2.5%;
}

#repetition-parameters p {
  margin-top: 3%;
}

.middleP {
  margin-right: 5%;
}


/* Stili specifici per desktop */
@media screen and (min-width: 1024px) {
  .section {
    padding-top: 1%;
    padding-left: 0;
    padding-right: 0;
  }
}


</style>
  