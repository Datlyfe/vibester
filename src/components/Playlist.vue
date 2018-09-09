<template>
  <div v-if="noPlaylist" class="empty animated fadeIn">
    <div class="msg">
      <i class="fa fa-info"></i>
      <span>You Have No PLaylists</span>
    </div>
  </div>
  <div v-else>
    <Header :cap="false" v-if="p.name" :title="getName(p.name)">
      <div class="search" slot="search"></div> <!-- IDK FILLER -->
      <template class="actions" slot="actions">
         <h4 @click="$emit('delete',p)" style="cursor:pointer"  class="header__label small">
          <i class="fa fa-trash"></i> Delete
        </h4>
         <h4 @click="$emit('rename',p)" style="cursor:pointer" class="header__label small">
           <i class="fa fa-pencil"></i> Rename
        </h4>
      </template>
    </Header>
    <div v-if="!isEmpty" class="p-feed animated fadeIn">
      <ul class="p-feed-list">
        <li @click="cue(song)" class="p-song" v-for="(song,index) in p.songs" :key="song.id">
          <span class="index">{{index+1}}</span>
          <div class="p-song-info">
            <span class="title">{{song.title}}</span>
            <span class="artist">{{song.artist}}</span>          
          </div>
        </li>
      </ul>
    </div>
    <div v-else >
      <div class="empty">
        <div class="msg">
          <i class="fa fa-info"></i>
          <span>Playlist is Empty</span>
        </div>
      </div>
    </div>
  </div>
  
  
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import Header from '@/components/Header.vue';

import { IPlaylist } from "@/models/playlist";
import { ISong } from '@/models/song';


export default Vue.extend({
  props: ["p", "noPlaylist"],
  components: {
    Header
  },
  data() {
    return {};
  },
  methods: {
    cue(song: ISong) {
      this.$store.dispatch("PLAY_SONG", song);
    },
    getBgImg(src) {
      return { backgroundImage: `url(${src})` };
    },
    getName(name){
      return `Reading From PLaylist : ${name}`
    }
  },
  computed: {
    isEmpty() {
      return this.p.songs && this.p.songs.length == 0;
    }
  },
  mounted() {
  }
});
</script>
