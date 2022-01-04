<template>
  <header class="the-nav">    
    <router-link to="/">Cryptos Data</router-link> |      
    <router-link to="/settings">Settings</router-link>
  </header>
  <main>
    <router-view />
  </main>
  <footer class="footer fixed-bottom">
    <Footer />
  </footer>  
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "Main",
  components: {
    Footer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.the-nav {
  padding: 30px;
}

.the-nav a {
  font-weight: bold;
  color: #2c3e50;
}

.the-nav a.router-link-exact-active {
  color: #42b983;
}
</style>
