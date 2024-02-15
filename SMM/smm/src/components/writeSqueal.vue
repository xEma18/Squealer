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
            <figure class="figure image is-64x64">
              <img :src=vipProfilePic alt="Profile Picture" class="is-rounded">
            </figure>
          </div>
          <div class="column is-10">
            <div v-if="image" class="image-container">
              <img :src="image" alt="Uploaded">
            </div>
            <div v-else-if="video" class="image-container">
              <video controls>
                <source :src="video">
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else-if="showMap" ref="mapContainer" class="map-container" id="map-container" style="height: 400px;"></div>
            <div v-else-if="showRandomNews && randomNews" class="random-news-container">
              <h3 class="title">{{ randomNews.title }}</h3>
              <p>{{ randomNews.description }}</p>
              <a :href="randomNews.url" target="_blank">Leggi di più</a>
            </div>
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
            <span class="icon" @click="fetchRandomNews"><i class="fas fa-newspaper"></i></span>
          </div>
          <div class="control">
            <span class="icon" @click="fetchRandomImage"><i class="fas fa-images"></i></span>
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
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

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
        showMap: false, 
        mapInfo: { lat: null, lng: null, zoom: 13 }, 
        randomNews: null, 
        showRandomNews: false, 
        publicMode: false, 
        
        isTemporizzato: false,
        numeroInvii: 1,
        intervalloInvio: 1,
        noDailyCharsLeft: false,
        noWeeklyCharsLeft: false,
        noMonthlyCharsLeft: false,
      };
    },
    watch:{
      numeroInvii(newVal, oldVal) {
      this.updateCharacterCount();
    },
  },
    methods: {
      returnIfRecipientIsEmpty() {
        if (this.recipients.length === 0) {
          alert("Please specify at least one recipient before writing.");
          this.image = ""; 
          this.video = "";
          return true;
        }
      },

      navigateToFeed() {
        this.$router.push('/SMM/');
      },
      async updateCharLeft() {
        try {
          const requestBody = {
            username: this.accountData.vipManaged,
            caratteriGiornalieriUsati: this.dailyCharsUsed,
            caratteriSettimanaliUsati: this.weeklyCharsUsed,
            caratteriMensiliUsati: this.monthlyCharsUsed,
          };

          const response = await axios.post('/updateCharsLeft', requestBody);

        } catch (error) {
          console.error("Errore durante l'aggiornamento dei caratteri rimanenti:", error);
          alert("Errore durante l'aggiornamento dei caratteri rimanenti.");
        }
      },
      async handlePostSqueal() {
        if(this.returnIfRecipientIsEmpty()) return;


        if (this.publicMode && this.dailyCharsUsed > this.dailyChars) {
          alert("You used too much characters");
          return;
        }

        const hasOfficialChannel = this.recipients.some(recipient => recipient.startsWith("§") && recipient.substring(1).toUpperCase() === recipient.substring(1));
        if (hasOfficialChannel) {
          alert("Cannot send squeal to an official channel (written in uppercase).");
          return;
        }

        const hasChannel = this.recipients.some(recipient => recipient.startsWith("§"));
        if(this.isTemporizzato && hasChannel){
          alert("Cannot send temporized squeal to a channel. No Spam!");
          return;
        }

        const newSqueal = {
          mittente: this.accountData.vipManaged,
          destinatari: this.recipients,
          text: this.image === "" ? this.text : "",
          emoticonNum: { verygood: 0, good: 0, bad: 0, verybad: 0 },
          impression: 0,
          commentsNum: 0,
          emoticonGivenBy: { verygood: [], good: [], bad: [], verybad: [] },
          impressionsGivenBy: {},
          bodyImage: this.image||this.video||"",
          date: new Date(),
          profilePic: this.vipProfilePic,
          mapLocation: this.showMap ? this.mapInfo : null,
          category: this.publicMode ? "Public" : "Private",
        };

        if (this.isTemporizzato) {
          const requestBody = {
            squeal: newSqueal,
            intervalloInvio: this.intervalloInvio,
            numeroInvii: this.numeroInvii,
          };

          axios.post(`/scheduleSqueal`, requestBody).catch(error => {
            console.error("Errore durante la programmazione dello squeal:", error);
          });
        } else {
          try {
            const response = await axios.post(`/postSqueal`, newSqueal);
            newSqueal._id = response.data._id;
          } catch (error) {
            console.error("Errore durante il salvataggio del post:", error);
          }
        }
        if(this.publicMode) this.updateCharLeft();
        
        const channelNames = this.recipients.filter(recipient => recipient.startsWith("§"));
        channelNames.forEach(async (channelName) => {
          try {
            await axios.post(`/addSquealToChannel`, {
              squealId: newSqueal._id,
              channelName: channelName,
            });
          } catch (error) {
            console.error(`Error updating channel ${channelName}:`, error);
          }
        });

        this.$router.push('/SMM/');

      },
      updateCharacterCount() {
        const textLength = this.text.length;

        if (this.publicMode) {
          const charCount = this.image || this.video || this.showMap ? 125 : textLength;
          this.dailyCharsUsed = this.startDailyCharsUsed + charCount * this.numeroInvii;
          this.weeklyCharsUsed = this.startWeeklyCharsUsed + charCount * this.numeroInvii;
          this.monthlyCharsUsed = this.startMonthlyCharsUsed + charCount * this.numeroInvii;
        }
      },
      handleImageChange(e) {
        if(this.returnIfRecipientIsEmpty()) return;
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.image = e.target.result;
            this.video = ''; 
            this.text = ''; 
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
        if(this.returnIfRecipientIsEmpty()) return;
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.video = e.target.result;
            this.image = '';
            this.text = '';
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
        if(this.returnIfRecipientIsEmpty()) return;
        this.showMap = true;
        this.$nextTick(() => {
        this.initializeMap();
        if(this.publicMode){
          this.dailyCharsUsed = this.startDailyCharsUsed + 125 * this.numeroInvii;
          this.weeklyCharsUsed = this.startWeeklyCharsUsed + 125 * this.numeroInvii;
          this.monthlyCharsUsed = this.startMonthlyCharsUsed + 125 * this.numeroInvii;
        }
        });
      },
      initializeMap() {
        if (!this.mapRef) { // Verifica se la mappa è già stata inizializzata
          const map = L.map('map-container').setView([this.mapInfo.lat || 45.4642, this.mapInfo.lng || 9.1900], this.mapInfo.zoom);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            const customIcon = L.icon({
            iconUrl: 'https://freesvg.org/img/Map-Pin.png', 
            iconSize: [38, 38], 
            iconAnchor: [19, 38], 
            popupAnchor: [-3, -76] 
          });
            L.marker([lat, lng], {icon: customIcon}).addTo(map);
            this.mapInfo.lat = lat;
            this.mapInfo.lng = lng;
          });

          this.mapRef = map;
        } else {
          this.mapRef.setView([this.mapInfo.lat, this.mapInfo.lng], this.mapInfo.zoom);
        }
      },
      async fetchRandomNews() {
        if(this.returnIfRecipientIsEmpty()) return;
        this.image= '';
        this.video= '';
        this.showMap= false;
        
        try {
          const response = await axios.get('/randomNews');
          this.randomNews = response.data; 
          this.showRandomNews = true; 
        } catch (error) {
          console.error('Errore durante il recupero delle notizie casuali:', error);
          alert('Errore nel recupero delle notizie casuali. Si prega di riprovare.');
        }
        this.text = this.randomNews.title + ' ' + this.randomNews.description + ' ' + this.randomNews.url;

        const titleLength = this.randomNews.title ? this.randomNews.title.length : 0;
        const descriptionLength = this.randomNews.description ? this.randomNews.description.length : 0;
        const urlLength = this.randomNews.url ? this.randomNews.url.length : 0;
        const charactersUsed = (titleLength + descriptionLength + urlLength) * this.numeroInvii;
        if(this.publicMode){
          this.dailyCharsUsed = this.startDailyCharsUsed + charactersUsed;
          this.weeklyCharsUsed = this.startWeeklyCharsUsed + charactersUsed;
          this.monthlyCharsUsed = this.startMonthlyCharsUsed + charactersUsed;
        }
      },
      async fetchRandomImage() {
        if(this.returnIfRecipientIsEmpty()) return;
        try {
          const response = await axios.get('/randomImage');
          this.image = response.data.imageUrl; 
          this.video = ''; 
          this.showMap = false; 
        } catch (error) {
          console.error('Errore durante il recupero di un\'immagine casuale:', error);
          alert('Errore nel recupero dell\'immagine casuale. Si prega di riprovare.');
        }
        if(this.publicMode){
          this.dailyCharsUsed = this.startDailyCharsUsed + 125 * this.numeroInvii;
          this.weeklyCharsUsed = this.startWeeklyCharsUsed + 125 * this.numeroInvii;
          this.monthlyCharsUsed = this.startMonthlyCharsUsed + 125 * this.numeroInvii;
        }
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
        if (this.accountData) {
          const response = await axios.post(`/getUserImageAndCharLeft`, { username: this.accountData.vipManaged });
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

.figure.image.is-64x64 {
  display: inline-block;
  width: 64px; 
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}

.figure.image.is-64x64 img {
  width: 100%;
  height: 100%; 
  object-fit: cover; 
}
.characterCounterContainer {
  margin-top: 3%;
  margin-bottom: 3%;
}

.image-container img, .map-container {
  max-width: 80%;
  max-height: 400px;
  display: block; 
  object-fit: contain; 
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
  background-color: #DBB77C; 
  color: #5B3C1D; 
  border-color: #DBB77C; 
}

.level-item.button.is-white:hover {
  background-color: #c19a6b; 
  color: #ffffff; 
}

.textarea, .map-container {
  box-shadow: 0 2px 5px rgba(91, 60, 29, 0.2); 
  border: 1px solid #9a9a9a; 
}

.level-item.button.is-white:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.textarea, img  {
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


@media screen and (min-width: 1024px) {
  .section {
    padding-top: 1%;
    padding-left: 0;
    padding-right: 0;
  }
}


</style>
  