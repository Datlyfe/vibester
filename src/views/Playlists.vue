<template>
<div class="playlists">
  <!-- HEADER -->
  <Header title="Playlists">
    <template slot="actions">
      <h4 style="cursor:pointer" @click="handleNewPlaylist" class="header__label small">
        <i class="fa fa-plus"></i> New Playlist
      </h4>
    </template>
  </Header>
  <!-- <div class="a">
    <div class="b">
       <ul class="p-list">
        <li @click="goToPlaylist(p)" class="p-list-item" v-for="(p) in playlists" :key="p.name" >
          <span class="name">{{p.name}}</span>
          <div class="actions">
          </div>
        </li>
        <li v-show="mode" class="p-list-item"> <input ref="input" placeholder="New Playlist" @keydown.13="addPlaylist" v-model="playlistName" type="text"> </li>
      </ul>
      
    </div>
    <div class="c">
      <router-view></router-view>
    </div>
  </div> -->
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
export default Vue.extend({
  data() {
    return {
      mode:false,
      playlistName:'',
      playlists: [] as Array<any>
    };
  },
  components: {
    Header
  },
  methods: {
    goToPlaylist(p){
      this.$router.push({name:'playlist',params:{id:p.name}})
    },
    handleNewPlaylist(){
      this.mode=true;
      setTimeout(()=>{
        (this.$refs.input as HTMLInputElement).focus()
      },1)
    },
    addPlaylist() {
      this.playlists.push({ name: this.playlistName });
      this.mode=false;
      this.playlistName=''
    },
    deletePlaylist(name){
      this.playlists=this.playlists.filter(p=>p.name!=name)
    }
  }
});
</script>


