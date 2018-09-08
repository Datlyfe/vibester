<template>
  <div>
    <h1>{{id}}</h1>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import bus from "@/services/bus";
export default Vue.extend({
  data(){
    return{
      id:null as number
    }
  },
  mounted(){
    bus.$on('playlistCue',(id)=>{
      this.id=id;
    })
  }
})
</script>
