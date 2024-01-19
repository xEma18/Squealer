<template>
    <div class="field">
      <label class="label">Seleziona VIP</label>
      <div class="control">
        <div class="select">
          <select v-model="selectedVip">
            <option v-for="vip in vips" :value="vip">{{ vip.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedVip: null,
        vips: [] // Puoi popolare questo array con i dati dei VIP
      };
    },
  };
  </script>
  