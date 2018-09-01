<template>
  <div class="files">
    <!-- HEADER -->
    <Header title="Tunes">
      <!-- SEARCH -->
      <div class="search" slot="search">
        <i class="fa fa-search"></i>
        <input v-model="search" autocomplete="off" name="search" placeholder="Search" class="search__input" type="text">
      </div>
      <!-- ACTIONS -->
      <template slot="actions">
        <h4 style="cursor:pointer" @click="setFolder" class="header__label small">
          <i class="fa fa-folder"></i> Pick Folder
        </h4>
      </template>
    </Header>
    <!-- LOADER -->
    <div v-if="loading" class="loader"></div>
    <!-- TUNE LIST -->
    <TuneList v-show="!loading"  :songs="songs"/>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
import TuneList from "@/components/TuneList.vue";
import { ipcRenderer } from "electron";
export default Vue.extend({
  data() {
    return {
      search: ""
    };
  },
  components: {
    Header,
    TuneList
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    songs() {
      return this.$store.state.localSongs.filter(song => {
        return (song.title + song.artist)
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    }
  },
  methods: {
    setFolder() {
      ipcRenderer.send("setFolder");
    }
  }
});
</script>
