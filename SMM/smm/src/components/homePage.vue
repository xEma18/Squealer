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

    <!-- Sezione Filtri -->
    <section id="filters">
      <!-- Struttura dei filtri -->
    </section>

    <!-- Sezione Squeal -->
    <section id="squeal">
      <h3 class="title is-3" style="margin:13px">VIP's Squeals:</h3>
        <div id="scrolling-wrapper-flexbox">
          <div v-for="(squealItem, index) in squealsWithSpaces" :key="index" class="card ms-1" :id="'card-' + index">
            <!-- Qui inserisci i contenuti della card, esempio: -->
            <div class="card-content">
              <div class="content">
                <h3 class="title is-3">{{ squealItem.mittente }}</h3>
                <p>Destinatari: {{ squealItem.destinatari.join(', ') }}</p>
                <p>Testo: {{ squealItem.text }}</p>
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
      monthlyCharsLeft: 0
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:3001/squeals');
      this.squeals = await response.json();
      console.log(this.squeals);
      // Filtro nell'array iterando con squeals se ogni componente dell'array this.squeals è uguale al manager che va reso poi dinamico 
      this.squeals = this.squeals.filter(squeals => squeals.mittente === "@jacques");
    } catch (error) {
      console.error('Errore durante il recupero degli squeal:', error);
    }

    try {
        const response = await fetch('http://localhost:3001/getUserImageAndCharLeft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Rendere dinamico col nome del manager
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
    squealsWithSpaces() {
      return this.squeals.map(squeal => ({
        ...squeal,
        destinatari: squeal.destinatari.map(dest => " " + dest)
      }));
    }
  },
  methods: {
    modifyButton(cardIndex) {
    // Logica per gestire la modifica della card
    console.log('Modificando la card numero:', cardIndex);
    // Qui puoi chiamare altre funzioni o logiche specifiche per la modifica
    },
    toggleBurgerMenu() {
      this.isBurgerMenuActive = !this.isBurgerMenuActive;
    }
    }
  };
</script>

<style scoped>
.navbar{
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
  padding: 10px; /* Aggiunge un padding intorno alle card */
}

.card {
  margin-bottom: 10px; /* Aggiunge un margine inferiore a ciascuna card */
}
</style>
