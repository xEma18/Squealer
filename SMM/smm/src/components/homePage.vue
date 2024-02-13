<template>
  <div id="body">
    <!-- Navbar e altre sezioni della pagina -->
    <section id="navbar">
      <nav class="navbar is-fixed-top is-black" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="#">
            <h3 class="title has-text-grey-lighter is-size-5-mobile">SMM DASHBOARD</h3>
          </a>

          <!-- Elementi fissi per essere mostrati nella navbar mobile e non nel burger-->
          <div class="navbar-custom">
            <a href="#" class="navbar-item has-text-grey-lighter is-size-7-mobile">
              VIP's Squealers
            </a>
            <a class="navbar-item has-text-grey-lighter is-size-7-mobile">
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
              <b>Daily chars:</b> &nbsp;{{ dailyCharsLeft }}
            </div>
            <div class="navbar-item">
              <b>Weekly chars:</b> &nbsp;{{ weeklyCharsLeft }}
            </div>
            <div class="navbar-item">
              <b>Monthly chars:</b> &nbsp;{{ monthlyCharsLeft }}
            </div>
          </div>
        </div>
      </nav>
    </section>

    <!-- Sezione Squeal -->
    <section id="squeal">
      <h4>Filters:</h4>
      <select class="select" v-model="selectedCategory" @change="setCategory(selectedCategory)">
        <option value="All">Tutte le Categorie</option>
        <option value="Popular">Popular</option>
        <option value="Unpopular">Unpopular</option>
        <option value="Controversial">Controversial</option>
        <option value="Private">Private</option>
      </select>
      <button @click="ordinaPerReazioni">Order for reactions</button>

      <h3 class="title is-3" style="margin:13px">VIP's Squeals:</h3>
      <div id="scrolling-wrapper-flexbox">
        <div v-for="(squealItem, index) in filteredSqueals" :key="index" class="card ms-1" :id="'card-' + index">
          <!-- Qui inserisci i contenuti della card, esempio: -->
          <div class="card-content">
            <div class="content">
              <h3 class="title is-3">{{ squealItem.mittente }}</h3>
              <h3 class="subtitle is-5">Destinatari: {{ squealItem.destinatari.join(', ') }}</h3>
              <p><b>Category:</b> {{ squealItem.category }}</p>
              <p><b>Text:</b> {{ squealItem.text }}</p>
              <p><span class="material-symbols-outlined">thumb_up</span> {{ squealItem.emoticonNum.good }}</p>
              <p><span class="ms-2 material-symbols-outlined">thumb_down</span> {{ squealItem.emoticonNum.bad }}</p>
              <p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z">
                  </path>
                </svg>{{ squealItem.impression }} </p>
            </div>
          </div>
          <!-- Pulsante Modifica all'interno della card -->
          <footer class="card-footer is-justify-content-center">
            <button class="button is-dark" @click="modifyButton(index)">
              Visualizza commenti
            </button>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      squeals: [], // Array per memorizzare i dati degli squeal
      isBurgerMenuActive: false,
      dailyCharsLeft: 0,
      weeklyCharsLeft: 0,
      monthlyCharsLeft: 0,
      selectedCategory: 'All', // Categoria selezionata per il filtraggio

    };
  },
  async mounted() {
    //const savedData = sessionStorage.getItem("accountData");
    //const accountData = JSON.parse(savedData);
    //const username = accountData.username;
    try {
      const response = await fetch('http://localhost:3001/squeals');
      this.squeals = await response.json();
      console.log(this.squeals);
      // Filtro nell'array iterando con squeals se ogni componente dell'array this.squeals è uguale al manager che va reso poi dinamico 
      this.squeals = this.squeals.filter(squeals => squeals.mittente === "@jacques"); //TODO
    } catch (error) {
      console.error('Errore durante il recupero degli squeal:', error);
    }

    try {
      const response = await fetch('http://localhost:3001/getUserImageAndCharLeft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Rendere dinamico col nome del manager TODO
        body: JSON.stringify({ username: "@jacques" })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const UserData = await response.json();
      this.dailyCharsLeft = UserData.caratteriGiornalieri - UserData.caratteriGiornalieriUsati;
      this.weeklyCharsLeft = UserData.caratteriSettimanali - UserData.caratteriSettimanaliUsati;
      this.monthlyCharsLeft = UserData.caratteriMensili - UserData.caratteriMensiliUsati;

    } catch (error) {
      console.error('Errore durante il recupero dei dati utente:', error);
    }

  },
  computed: {
    //funzione per filtrare gli squeal in base alla categoria selezionata
    filteredSqueals() {
      if (this.selectedCategory === 'All') {
        return this.squeals;
      }
      this.squeals.map(squeal => ({
        ...squeal,
        destinatari: squeal.destinatari.map(dest => " " + dest)
      }));
      return this.squeals.filter(squeal => squeal.category === this.selectedCategory);
    },
  },
  methods: {
    modifyButton(cardIndex) {
      // Logica per gestire la modifica della card
      console.log('Modificando la card numero:', cardIndex);
      // Qui puoi chiamare altre funzioni o logiche specifiche per la modifica
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
        // Assumendo che ogni squeal abbia 'emoticonNum' con 'good' e 'bad'
        const totalReactionsA = (a.emoticonNum.good || 0) + (a.emoticonNum.bad || 0);
        const totalReactionsB = (b.emoticonNum.good || 0) + (b.emoticonNum.bad || 0);

        return totalReactionsB - totalReactionsA; // Ordina per numero totale di reazioni decrescente
      });
      // Aggiorna l'array per assicurare la reattività
      this.squeals = [...this.squeals];
    }
  }
};
</script>

<style scoped>
.navbar {
  height: 3rem;
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
  /* Aggiunge un padding intorno alle card */
}

.card {
  margin-bottom: 10px;
  /* Aggiunge un margine inferiore a ciascuna card */
}
</style>
