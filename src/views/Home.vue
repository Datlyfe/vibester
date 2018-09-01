<template>
  <div class="container">
    <Menu/>
    <Main ref="main"/>
    <Cue v-if="showCue"/>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Main from "@/components/Main.vue";
import Menu from "@/components/Menu.vue";
import Cue from "@/components/Cue.vue";
import Footer from "@/components/Footer.vue";

import bus from "@/services/bus";

export default Vue.extend({
  name: "home",
  data(){
    return{
      showCue:true
    }
  },
  components: {
    Menu,
    Main,
    Cue,
    Footer
  },
  created(){
    bus.$on('toggleCue',()=>{
      this.showCue=!this.showCue;
      (this.$refs.main.$el as HTMLElement).classList.toggle('expand');
    })
  }
});
</script>
