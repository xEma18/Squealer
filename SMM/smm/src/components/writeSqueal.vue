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
              <img :src=vipProfilePic alt="Profile Picture" class="is-rounded">
            </figure>
          </div>
          <div class="column is-10">
            <!-- Contenuto dell'anteprima di pubblicazione post (testo, immagine o mappa) -->
            <div v-if="image" class="image-container">
              <img :src="image" alt="Uploaded">
            </div>
            <div v-else-if="video" class="image-container">
              <video controls>
                <source :src="video">
                Your browser does not support the video tag.
              </video>
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
              <input id="fileInput" type="file" accept="video/*" @change="handleVideoChange" hidden>
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
                            :daily-char-limit="dailyChars"
                            :weekly-char-limit="weeklyChars"
                            :monthly-char-limit="monthlyChars">
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
  import axios from 'axios';

  export default {
    components: {
      CharacterCount
    },
    data() {
      return {
        accountData: null,
        username: '',
        vipProfilePic: '',
        startDailyCharsUsed: 0,
        startWeeklyCharsUsed: 0,
        startMonthlyCharsUsed: 0,
        dailyChars: 0,
        weeklyChars: 0,
        monthlyChars: 0,
        dailyCharsUsed: 0,
        weeklyCharsUsed: 0,
        monthlyCharsUsed: 0,

        text: '', 
        image: '', 
        video: '',
        recipientsText: '', 
        recipients: [], 
        showMap: false, // Mostra mappa
        mapInfo: { lat: null, lng: null, zoom: 13 }, // Informazioni mappa
        publicMode: false, 
        
        isTemporizzato: false,
        numeroInvii: 1,
        intervalloInvio: 1,
        noDailyCharsLeft: false,
        noWeeklyCharsLeft: false,
        noMonthlyCharsLeft: false,
      };
    },
    methods: {
      returnIfRecipientIsEmpty() {
        if (this.recipients.length === 0) {
          alert("Please specify at least one recipient before writing.");
          this.image = ""; // Usa `this.image` per accedere alla proprietà reattiva
          return true;
        }
      },

      navigateToFeed() {
        this.$router.push('/SMM/');
      },
      handlePostSqueal() {
        // Gestione invio post: devo aspettare di avere dalla homepage i dati utente
      },
      updateCharacterCount() {
        const textLength = this.text.length;
        
        // Aggiorna i contatori dei caratteri
        this.dailyCharsUsed = this.startDailyCharsUsed + textLength * this.numeroInvii;
        this.weeklyCharsUsed = this.startWeeklyCharsUsed + textLength * this.numeroInvii;
        this.monthlyCharsUsed = this.startMonthlyCharsUsed + textLength * this.numeroInvii;
      },
      handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.image = e.target.result; // Imposta l'immagine come base64
            this.video = ''; // Resetta il video
            this.text = ''; // Pulisce il testo
          };
          reader.readAsDataURL(file);
        }
        if(this.publicMode){
          this.dailyCharsUsed = this.startDailyCharsUsed + 125 * this.numeroInvii;
          this.weeklyCharsUsed = this.startWeeklyCharsUsed + 125 * this.numeroInvii;
          this.monthlyCharsUsed = this.startMonthlyCharsUsed + 125 * this.numeroInvii;
        }
      },
      handleVideoChange(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.video = e.target.result; // Imposta il video come base64
            this.image = ''; // Resetta l'immagine
            this.text = ''; // Pulisce il testo
          };
          reader.readAsDataURL(file);
        }
        if(this.publicMode){
          this.dailyCharsUsed = this.startDailyCharsUsed + 125 * this.numeroInvii;
          this.weeklyCharsUsed = this.startWeeklyCharsUsed + 125 * this.numeroInvii;
          this.monthlyCharsUsed = this.startMonthlyCharsUsed + 125 * this.numeroInvii;
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
      async fetchUserData() {
      try {
        if (this.accountData && this.accountData.username) {
          const response = await axios.post(`http://localhost:3001/getUserImageAndCharLeft`, { username: this.accountData.vipManaged });
          this.userData = response.data;
          this.vipProfilePic = response.data.image;
          this.dailyChars= response.data.caratteriGiornalieri;
          this.weeklyChars= response.data.caratteriSettimanali;
          this.monthlyChars= response.data.caratteriMensili;
          this.dailyCharsUsed = response.data.caratteriGiornalieriUsati;
          this.weeklyCharsUsed = response.data.caratteriSettimanaliUsati;
          this.monthlyCharsUsed = response.data.caratteriMensiliUsati;
          this.startDailyCharsUsed = response.data.caratteriGiornalieriUsati;
          this.startWeeklyCharsUsed = response.data.caratteriSettimanaliUsati;
          this.startMonthlyCharsUsed = response.data.caratteriMensiliUsati;
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati utente:", error);
      }
    },
    async fetchManagedUsername() {
      const savedData = sessionStorage.getItem("accountData");
      if (savedData) {
        this.accountData = JSON.parse(savedData);
        console.log(this.accountData);
        console.log(this.accountData.username);
      }
    },
    },
    mounted() {
      this.fetchManagedUsername();
      this.fetchUserData();
      
    },
    computed:{
      maxLength() {
        const remainingDailyChars = this.dailyChars - this.startDailyCharsUsed;
        return remainingDailyChars;
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
  