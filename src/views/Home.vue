<template>
  <div class="container">
    <Menu/>
    <Main/>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Main from "@/components/Main.vue";
import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";

import "font-awesome/css/font-awesome.css";
import "@/sass/app.scss";

export default Vue.extend({
  name: "home",
  data() {
    return {};
  },
  components: {
    Menu,
    Main,
    Footer
  }
});
</script>
