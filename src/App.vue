<script setup>
import ChatView from './views/ChatView.vue';
</script>

<template>
  <div class="page">
    <ChatView />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  background-image: url(../src/assets/estec-bg.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
