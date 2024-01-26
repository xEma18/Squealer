<template>
  <div id="body">
    <!-- Navbar e altre sezioni della pagina -->
    <section id="navbar">
      <nav class="navbar is-fixed-top is-black" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <h3 class="title has-text-grey-lighter">SMM DASHBOARD</h3>
        </a>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true">
          </span>
          <span aria-hidden="true">
          </span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a href="#" class="navbar-item">
            VIP's Squeal
          </a>
          <a href="#" class="navbar-item">
            Write a Squeal 
          </a>
        </div>
      </div>

      <div class="navbar-dropdown">
          <a class="navbar-item">
            VIP's Squeal
          </a>
          <a class="navbar-item">
            Write a Squeal 
          </a>
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
  }
  }
};
</script>

<style scoped>
.navbar{
  height: 4rem;
}

#body {
  padding: 0;
  margin: 0;
}

#squeal {
  margin: 80px; /* Aggiunge un margine intorno al body */
}

#scrolling-wrapper-flexbox {
  padding: 10px; /* Aggiunge un padding intorno alle card */
}

.card {
  margin-bottom: 10px; /* Aggiunge un margine inferiore a ciascuna card */
}
</style>
