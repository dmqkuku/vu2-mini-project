<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <i class="bi-suit-heart"></i>
    <BlackJackMain></BlackJackMain>
  </div>
</template>

<script>
import BlackJackMain from './components/test-blackjack.vue'
export default {
  name: 'App',
  components : {
    BlackJackMain
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
