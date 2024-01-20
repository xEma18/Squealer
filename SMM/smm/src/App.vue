<template> <!-- scrivo il codice html che il componente metterà in index.html -->
  <div id="app">
    <router-view></router-view> <!--qui è dove il router mette le componentei che vengono caricate in base al path richiesto-->
  </div>
</template>

<script>


export default {//scrivendo "export default" esporto App.vue (non devo scriverlo tra i components)
  name: 'App',//assegno un nome al componente (utile per il debugging)
  components: {//scrivo i componenti che ho usato in questo componente  

  },
  methods: {
    //qui scrivo le funzioni che voglio usare in questo componente
  },
};
</script>
