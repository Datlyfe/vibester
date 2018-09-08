<template>
  <div class="playlists animated fadeIn">
    <div class="side">
      <Header title="Playlists">
        <div class="actions" slot="actions">
          <i @click="newPlaylist" class="fa fa-plus"></i>
        </div>
      </Header>
      <ul class="p-list">
        <li @contextmenu="openMenu(p.id)" :class="{'p-active':selected==p.id}" @click="goToPlaylist(p)" class="p-item" v-for="p in playlists" :key="p.id">
          <div class="p-active-bar"></div>
          <template v-if="write && p.id==selected">
            <input maxlength="20" :value="p.name" class="p-input" @blur="cancelRename" @keypress.13="rename" autofocus  ref="pInput" type="text">
          </template>
          <template v-else>{{p.name}}</template>

        </li>
      </ul>
    </div>
    <div class="body">
      <Playlist/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
import Playlist from "@/components/Playlist.vue";
import bus from "@/services/bus";
import electron from "electron";
import { IPlaylist } from '@/models/playlist';

export default Vue.extend({
  data() {
    return {
      selected: null,
      write: false
    };
  },
  components: {
    Header,
    Playlist
  },
  computed: {
    playlists() {
      return this.$store.state.playlists;
    }
  },
  methods: {
    openMenu(id) {
      const template: electron.MenuItemConstructorOptions[] = [
        {
          label: "Rename",
          click: e => {
            this.selected = id;
            this.write = true;
            // BIG HACK INCOMING
            setTimeout(() => {
              (this.$refs.pInput[0] as HTMLInputElement).focus();
            }, 1);
            //
          }
        },
        {
          label: "Delete",
          click: () => this.$store.dispatch("DELETE_PLAYLIST", id)
        }
      ];
      const context = electron.remote.Menu.buildFromTemplate(template);
      context.popup({});
    },
    cancelRename() {
      this.write = false;
    },
    rename(e) {
      this.write = false;
      if(e.target.value==''){
        console.warn('empthy name not allowed');
        return;
      }
      this.$store.dispatch("RENAME_PLAYLIST", {
        id: this.selected,
        name: e.target.value
      });
    },
    goToPlaylist(p:IPlaylist) {
      this.selected = p.id;
      bus.$emit("playlistCue", p);
    },
    newPlaylist() {
      this.$store.dispatch("NEW_PLAYLIST");
    }
  }
});
</script>



<style lang="scss" scoped>
.side {
  background: #2e2e2e;
  padding: 3rem 2rem;
  width: 250px;
  border-right: 1px solid #333333;
}
.body {
  flex: 1;
}
</style>
