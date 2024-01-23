<template>
    <div id="paginaJaco" class="container">
      <SelectVip />
      <PostMessage />
      <Feed />
    </div>
  </template>
  
  <script>
  import SelectVip from './SelectVip.vue';
  import PostMessage from './PostMessage.vue';
  import Feed from './Feed.vue';
  
  export default {
    components: {
      SelectVip,
      PostMessage,
      Feed
    }
  };
  </script>
  