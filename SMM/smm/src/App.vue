<template>
  <div id="app" class="container">
    <SelectVip />
    <PostMessage />
    <Feed />
  </div>
</template>

<script>
import SelectVip from './components/SelectVip.vue';
import PostMessage from './components/PostMessage.vue';
import Feed from './components/Feed.vue';

export default {
  components: {
    SelectVip,
    PostMessage,
    Feed
  }
};
</script>
