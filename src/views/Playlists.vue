<template>
  <div class="playlists animated fadeIn">
    <div class="p-side">
      <Header title="Playlists">
        <div class="actions" slot="actions">
          <i @click="newPlaylist" class="fa fa-plus"></i>
        </div>
      </Header>
      <ul class="p-list">
        <li  @dblclick="startEdit(p)" @contextmenu="openMenu(p)" :class="{'p-active':selectedPlaylist.id==p.id}" @click="goToPlaylist(p)" class="p-item" v-for="p in playlists" :key="p.id">
          <template v-if="write && p.id==selectedPlaylist.id">
            <input maxlength="25" :value="p.name" class="p-input" @blur="cancelRename" @keypress.13="rename" autofocus  ref="pInput" type="text">
            <div class="p-active-bar"></div>
          </template>
          <template v-else>{{p.name}}</template>

        </li>
      </ul>
    </div>
    <div class="p-body">
      <Playlist @rename="handleRenameEvent" @delete="handleDeleteEvent" :noPlaylist="noPlaylist" :key="selectedPlaylist.id" :p="selectedPlaylist"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
import Playlist from "@/components/Playlist.vue";
import bus from "@/services/bus";
import electron from "electron";
import { IPlaylist } from "@/models/playlist";
import store from "@/store";

export default Vue.extend({
  data() {
    return {
      selectedPlaylist: { id: -1 } as IPlaylist,
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
    },
    noPlaylist() {
      return this.$store.state.playlists.length == 0;
    }
  },
  methods: {
    openMenu(p: IPlaylist) {
      const template: electron.MenuItemConstructorOptions[] = [
        {
          label: "Rename",
          click: () => this.startEdit(p)
        },
        {
          label: "Delete",
          click: () => this.delete(p.id)
        }
      ];
      const context = electron.remote.Menu.buildFromTemplate(template);
      context.popup({});
    },
    startEdit(p:IPlaylist) {
      this.selectedPlaylist = p;
      this.write = true;
      // BIG HACK INCOMING
      // IF THIS FAILS WE GOT PROBLEMS
      setTimeout(() => {
        (this.$refs.pInput[0] as HTMLInputElement).focus();
      }, 1);
      //
    },
    cancelRename() {
      this.write = false;
    },
    handleRenameEvent(p:IPlaylist){
      this.startEdit(p);
    },
    handleDeleteEvent(p:IPlaylist){
      this.delete(p.id)
    },
    delete(id){
      this.$store.dispatch("DELETE_PLAYLIST",id).then(()=>{
        this.selectedPlaylist=this.playlists[0] || {id:-1}
      })
    },
    rename(e) {
      this.write = false;
      if (e.target.value == "") {
        console.warn("empthy name not allowed");
        return;
      }
      this.$store.dispatch("RENAME_PLAYLIST", {
        id: this.selectedPlaylist.id,
        name: e.target.value
      });
    },
    goToPlaylist(p: IPlaylist) {
      this.selectedPlaylist = p;
      bus.$emit("playlistCue", p);
    },
    newPlaylist() {
      this.$store.dispatch("NEW_PLAYLIST").then((p: IPlaylist) => {
        this.selectedPlaylist = p;
      });
    }
  },
  mounted() {}
});
</script>



<style lang="scss" scoped>
.p-side {
  background: #2e2e2e;
  padding: 3rem 2rem;
  width: 300px;
  border-right: 1px solid #333333;
  height: -webkit-fill-available;
  overflow: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 8px #00000033;
  }
  &::-webkit-scrollbar {
    width: 2px;
    background-color: #303030;
  }
  &::-webkit-scrollbar-thumb {
    background: #c9c9c9;
  }
}
.p-body {
  position: relative;
  padding: 3rem 4rem;
  flex: 1;
  height: -webkit-fill-available;
  overflow: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 8px #00000033;
  }
  &::-webkit-scrollbar {
    width: 2px;
    background-color: #303030;
  }
  &::-webkit-scrollbar-thumb {
    background: #c9c9c9;
  }
}
</style>
