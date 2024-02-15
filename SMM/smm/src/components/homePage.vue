<template>
  <div id="body">
    <section id="navbar">
      <nav class="navbar is-fixed-top is-black" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="#">
            <h3 class="title has-text-grey-lighter is-size-5-mobile">SMM DASHBOARD</h3>
          </a>
          <div class="navbar-custom">
            <a @click="navigateToFeed" class="navbar-item has-text-grey-lighter is-size-7-mobile">
              Back to App
            </a>
            <a class="navbar-item has-text-grey-lighter is-size-7-mobile" href="#" @click="navigateToWriteSqueal">
              Write a Squeal
            </a>
          </div>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleBurgerMenu">
            <i class="fas fa-lg fa-solid fa-font"></i>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isBurgerMenuActive }">
          <div class="navbar-end">
            <div class="navbar-item">
              <b>Daily chars:</b> &nbsp;{{ dailyChars- dailyCharsUsed}}
            </div>
            <div class="navbar-item">
              <b>Weekly chars:</b> &nbsp;{{ weeklyChars - weeklyCharsUsed}}
            </div>
            <div class="navbar-item">
              <b>Monthly chars:</b> &nbsp;{{ weeklyChars - weeklyCharsUsed}}
            </div>
          </div>
        </div>
      </nav>
    </section>

    <section id="squeal">
      <div class="filter-section">
        <h4>Filters:</h4>
        <select class="select-filter" v-model="selectedCategory" @change="setCategory(selectedCategory)">
          <option value="All">Tutte le Categorie</option>
          <option value="Popular">Popular</option>
          <option value="Unpopular">Unpopular</option>
          <option value="Controversial">Controversial</option>
          <option value="Private">Private</option>
        </select>
        <button class="button-order" @click="ordinaPerReazioni">Order for reactions</button>
      </div>

      <h3 class="title is-3" style="margin:13px">VIP's Squeals:</h3>
      <div id="scrolling-wrapper-flexbox">
        <div v-for="(squealItem, index) in filteredSqueals" :key="index" class="card ms-1" :id="'card-' + index">
          <div class="card-content">
            <div class="content">
              <h3 class="title is-3">{{ squealItem.mittente }}</h3>
              <h3 class="subtitle is-5">Destinatari: {{ squealItem.destinatari.join(', ') }}</h3>
              <p><b>Category:</b> {{ squealItem.category }}</p>
              <p><b>Text:</b> {{ squealItem.text }}</p>
              <div class="emoji">
                <p><span class="material-symbols-outlined">thumb_up</span> {{ squealItem.emoticonNum.good }}</p>
                <p><span class="ms-2 material-symbols-outlined">thumb_down</span> {{ squealItem.emoticonNum.bad }}</p>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z">
                  </path>
                  </svg>{{ squealItem.impression }} </p>
              </div>
              
            </div>
            <div class="media">
                <video v-if="isBase64Video(squealItem.bodyImage)" controls>
                  <source :src="squealItem.bodyImage" type="video/mp4">
                </video>
                <img v-else-if="squealItem.bodyImage" :src="squealItem.bodyImage" alt="Placeholder image">
                <div v-else :id="'map-' + index" class="leaflet-map"></div>
              

            </div>
          </div>
          <footer class="card-footer is-justify-content-center">
            <button class="button is-dark" @click="fetchComments(squealItem)">
              Show Comments ({{ squealItem.comments.length }})
            </button>
            <div v-if="squealItem.isCommentsVisible" class="comments-container">
  <div v-for="comment in squealItem.postComments" :key="comment._id" class="comment">
    <img :src="comment.profilePic" alt="Foto profilo" class="profile-pic">
    <div class="comment-sender-text">
      <h5>{{ comment.mittente }}:</h5>
      <p>{{ comment.text }}</p>
    </div>
  </div>
</div>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

export default {
  name: 'HomePage',
  data() {
    return {
      managerData: {},
      vipData: {},
      squeals: [],
      isBurgerMenuActive: false,
      dailyChars: 0,
      weeklyChars: 0,
      monthlyChars: 0,
      dailyCharsUsed: 0,
      weeklyCharsUsed: 0,
      monthlyCharsUsed: 0,
      comments: [],

      selectedCategory: 'All', 

    };
  },
  async mounted() {
    this.fetchManagedUsername();
    this.fetchVipData();
    
    

    try {
      const response = await fetch('/squeals');
      this.squeals = await response.json();
      this.squeals = this.squeals.filter(squeals => squeals.mittente === this.managerData.vipManaged); 
      this.squeals.sort((a, b) => new Date(b.date) - new Date(a.date)); 
      
    } catch (error) {
      console.error('Errore durante il recupero degli squeal:', error);
    }
    this.createMaps();
  },
  computed: {
    filteredSqueals() {
      if (this.selectedCategory === 'All') {
        return this.squeals;
      }
      this.squeals.map(squeal => ({
        ...squeal,
        destinatari: squeal.destinatari.map(dest => " " + dest),
        isCommentsVisible: false,
        postComments: []
      }));
      return this.squeals.filter(squeal => squeal.category === this.selectedCategory);
    },
  },
  methods: {

    isBase64Image(data) {
      return data.startsWith('data:image/');
    },
  
    isBase64Video(data) {
      return data.startsWith('data:video/');
    },

    async fetchComments(squealItem) {
      if (!squealItem.isCommentsVisible) {
        try {
          const response = await axios.get(`/squealComments/${squealItem._id}`);
          squealItem.postComments = response.data;
        } catch (error) {
          console.error('Errore durante il recupero dei commenti:', error);
        }
      }
      squealItem.isCommentsVisible = !squealItem.isCommentsVisible;
    },

    async fetchVipData() {
      try {
        if (this.managerData) {
          console.log(this.managerData.vipManaged);
          const response = await axios.post(`/getUserImageAndCharLeft`, { username: this.managerData.vipManaged });
          this.vipData = response.data;
          this.dailyChars= response.data.caratteriGiornalieri;
          this.weeklyChars= response.data.caratteriSettimanali;
          this.monthlyChars= response.data.caratteriMensili;
          this.dailyCharsUsed = response.data.caratteriGiornalieriUsati;
          this.weeklyCharsUsed = response.data.caratteriSettimanaliUsati;
          this.monthlyCharsUsed = response.data.caratteriMensiliUsati;
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati utente:", error);
      }
    },
    async fetchManagedUsername() {
      const savedData = sessionStorage.getItem("accountData");
      if (savedData) {
        this.managerData = JSON.parse(savedData);
      }
    },
    modifyButton(cardIndex) {
    },
    toggleBurgerMenu() {
      this.isBurgerMenuActive = !this.isBurgerMenuActive;
    },
    setCategory(category) {
      console.log('Categoria selezionata:', category)
      this.selectedCategory = category;
    },
    ordinaPerReazioni() {
      console.log('Ordina per reazioni')
      this.squeals.sort((a, b) => {
        const totalReactionsA = (a.emoticonNum.good || 0) + (a.emoticonNum.bad || 0);
        const totalReactionsB = (b.emoticonNum.good || 0) + (b.emoticonNum.bad || 0);

        return totalReactionsB - totalReactionsA;
      });
      this.squeals = [...this.squeals];
    },

    navigateToWriteSqueal() {
    this.$router.push('/SMM/writeSqueal');
  },
  navigateToFeed() {
    this.$router.push('/App/Feed/');
    setTimeout(() => {
      window.location.reload();
    }, 500);
    

  },
  createMaps(){
    this.squeals.forEach((squealItem, index) => {
    if (squealItem.mapLocation) {
      this.initializeMap(squealItem, index);
    }
  }
  )},
  initializeMap(squealItem, index) {
  if (squealItem.mapLocation) {
    this.$nextTick(() => {
      setTimeout(() => {
        const mapId = 'map-' + index;
        if (document.getElementById(mapId)) {
          const map = L.map(mapId, {
            zoomControl: false,
            attributionControl: false,
          }).setView([squealItem.mapLocation.lat, squealItem.mapLocation.lng], squealItem.mapLocation.zoom);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
          }).addTo(map);
          const customIcon = L.icon({
            iconUrl: 'https://freesvg.org/img/Map-Pin.png', 
            iconSize: [38, 38],
            iconAnchor: [22, 94], 
            popupAnchor: [-3, -76]
          });
          L.marker([squealItem.mapLocation.lat, squealItem.mapLocation.lng], { icon: customIcon }).addTo(map);
        } else {
          console.error('Elemento mappa non trovato:', mapId);
        }
      }, 1000);
    });
  }
},

},
};
</script>

<style scoped>
.navbar {
  height: 3rem;
  z-index: 1000;
}

.profile-pic {
  width: 50px; 
  height: 50px;
  object-fit: cover; 
  border-radius: 50%;
}

.comments-container {
  width: 40%;
  max-height: 30vh;
  overflow-y: auto;
}

.comment {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 10px 0;
}

.leaflet-map {
  height: 200px;
  width: 100%;
}

.card-content{
  display: flex;
  flex-direction:row;
  width:100%;
  justify-content: center;
}
.media{
  width:40%;
}
.media img{
  max-height: 200px;
}
.content{
  width:40%;
}

.navbar-burger {
  align-self: center;
  top: 0.8rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-custom {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

#body {
  padding: 0;
  margin: 0;
}

#squeal {
  margin: 80px;
}

#scrolling-wrapper-flexbox {
  padding: 10px;
}

.card {
  margin-bottom: 10px;
}

.emoji {
  display: flex;
  flex-direction: row;
  gap: 25px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.select-filter {
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.select-filter:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.button-order {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.button-order:hover {
  background-color: #45a049;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}
</style>
