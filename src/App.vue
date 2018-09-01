<template>
  <div class="app">
    <Home/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import "font-awesome/css/font-awesome.css";
import "@/sass/app.scss";
import Home from "@/views/Home.vue";
export default Vue.extend({
  name: "app",
  components: {
    Home
  }
});
</script>
