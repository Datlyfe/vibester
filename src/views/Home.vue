<template>
  <div class="container">
    <Menu/>
    <Main/>
    <!-- <Cue/> -->
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Main from "@/components/Main.vue";
import Menu from "@/components/Menu.vue";
import Cue from "@/components/Cue.vue";
import Footer from "@/components/Footer.vue";

export default Vue.extend({
  name: "home",
  data() {
    return {};
  },
  components: {
    Menu,
    Main,
    Cue,
    Footer
  }
});
</script>
