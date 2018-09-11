<template>
  <div v-if="noPlaylist" class="empty animated fadeIn">
    <div class="msg">
      <i class="fa fa-info"></i>
      <span>You Have 0 Playlists</span>
    </div>
  </div>
  <div v-else-if="p.id==-1" class="empty animated fadeIn">
     <div class="msg">
        <i class="fa fa-info"></i>
        <span>Select A Playlist</span>
    </div>
  </div>
  <div v-else>
    <Header :cap="false" :title="p.name">
      <div class="search" slot="search"></div>
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
      <div ref="table" class="table">
        <virtual-list wclass="v-list" :size="35" :remain="15" :bench="0">
          <div @click="cue(song)" :class="{'songPlaying':songPlaying && songPlaying.id==song.id}" v-for="(song,index) in p.songs" class="row" :key="song.id">
            <div style="width:5%" class="cell">{{index+1}}</div>
            <div style="width:30%" class="cell">{{song.title}}</div>
            <div style="width:30%" class="cell">{{song.artist}}</div>
            <div style="width:10%" class="cell">{{song.duration}}</div>
            <div style="width:25%" class="cell indicator">
              <div class="playing-indicator">
                <div v-show="songPlaying && songPlaying.id==song.id" class="animation">
                  <div class="bar bar-first"></div>
                  <div class="bar bar-second"></div>
                  <div class="bar bar-third"></div>
                </div>
              </div>
            </div>
          </div>
        </virtual-list>
      </div>
    </div>
    <div v-else >
      <div class="empty">
        <div class="msg">
          <i class="fa fa-info"></i>
          <span>Playlist is Empty</span>
        </div>
         <!-- <div class="msg">
          <span>Add Some Tracks Here </span>
        </div> -->
      </div>
    </div>
  </div>
  
  
</template>


<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
import VirtualList from "vue-virtual-scroll-list";

export default Vue.extend({
  props: ["p", "noPlaylist"],
  components: {
    Header,
    VirtualList
  },
  data() {
    return {};
  },
  computed: {
    isEmpty() {
      return this.p.songs && this.p.songs.length == 0;
    },
    songPlaying() {
      return this.$store.state.songPlaying;
    }
  },
  methods: {
    openMenu(e: Event) {
      e.stopPropagation();
      console.log("log");
    },
    cue(song) {
      this.$store.dispatch("PLAY_SONG", {
        song,
        isLocal: true,
        inPlaylist: this.p.id
      });
    },
    getBgImg(src) {
      return { backgroundImage: `url(${src})` };
    },
    getName(name) {
      return `Reading From PLaylist : ${name}`;
    }
  },
  mounted() {
    let table = document.getElementsByClassName("v-list")[0];
    table && table.parentElement.classList.add("vv-list");
  }
});
</script>
