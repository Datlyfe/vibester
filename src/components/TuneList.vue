<template>
  <div ref="table" class="table">
    <!-- TABLE HEADER -->
    <div v-if="songs.length>0" class="row header">
      <div class="cell title">Title</div>
      <div class="cell artist">Artist</div>
      <div class="cell album">Album</div>
      <div class="cell genre">Genre</div>
      <div class="cell duration">Duration</div>

    </div>

    <!-- TABLE BODY -->
    <virtual-list wclass="v-list" :size="35" :remain="13" :bench="0">
      <div :class="{'selected':selected.includes(song.id)}" tabindex="-1" @contextmenu="showContextMenu(song.id)" @mousedown="selectSong($event,song.id,index)"  @dblclick="cue(song)" v-for="(song,index) in songs" class="row" :key="song.id">
        <div class="cell title">{{song.title}}</div>
        <div class="cell artist">{{song.artist}}</div>
        <div class="cell album">{{song.album}}</div>
        <div class="cell genre">{{song.genre[0]}}</div>
        <div class="cell duration">{{song.duration}}</div>
      </div>
    </virtual-list>

</div>
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import { ISong } from "@/models/song";
import electron from "electron";
import { isCtrlKey } from "@/services/utils";
import VirtualList from "vue-virtual-scroll-list";
import { IPlaylist } from '@/models/playlist';
const { shell, remote } = electron;
const { Menu } = remote;
export default Vue.extend({
  props: ["songs"],
  data() {
    return {
      selected: []
    };
  },
  components: {
    VirtualList
  },
  methods: {
    cue(song: ISong) {
      this.$store.dispatch("PLAY_SONG", song);
    },
    selectSong(e, id, index) {
      if (
        this.isLeftClick(e) ||
        (this.isRightClick(e) && this.isSelectableTrack(id))
      ) {
        if (isCtrlKey(e)) {
          this.toggleSelectionById(id);
        } else if (e.shiftKey) {
          if (this.selected.length === 0) {
            const selected = [id];
            this.selected = selected;
          } else this.multiSelect(index);
        } else {
          const selected = [id];
          this.selected = selected;
        }
      }
    },
    handleOutsideClick(e) {
      if (this.$refs.table && !this.$refs.table.contains(e.target)) {
        this.selected = [];
      }
    },
    showContextMenu(songId) {
      const selectedCount = this.selected.length;
      const playlistSubMenu:electron.MenuItemConstructorOptions[]=[
        {label:'New Playlist',click:()=>{
          this.$store.dispatch('NEW_PLAYLIST').then((p:IPlaylist)=>{
            this.$store.dispatch('ADD_TO_PLAYLIST',{songsIds:this.selected,playlistId:p.id})
          })
        }},
        {type:'separator'}
      ]
      this.$store.state.playlists.forEach((p:IPlaylist)=> {
        playlistSubMenu.push({
          label:p.name,
          click:()=>this.$store.dispatch('ADD_TO_PLAYLIST',{songsIds:this.selected,playlistId:p.id})
        })
      });
      const template: electron.MenuItemConstructorOptions[] = [
        {
          label:
            selectedCount > 1
              ? `${selectedCount} Tunes Selected`
              : `${selectedCount} Tune Selected`,
          enabled: false
        },
        {
          label: "Add to playlist",
          submenu:playlistSubMenu
        }
      ];

      const context = Menu.buildFromTemplate(template);
      context.popup({});
    },
    isSelectableTrack(id: number) {
      return !this.selected.includes(id);
    },
    toggleSelectionById(id: number) {
      let selected = [...this.selected];

      if (selected.includes(id)) {
        selected.splice(selected.indexOf(id), 1);
      } else {
        selected.push(id);
      }
      this.selected = selected;
    },
    multiSelect(index: number) {
      const tracks = [...this.songs];
      const selected = [...this.selected];
      const selectedInt = [];
      for (let i = 0; i < tracks.length; i++) {
        if (selected.includes(tracks[i].id)) {
          selectedInt.push(i);
        }
      }
      let base;
      const min = Math.min(...selectedInt);
      const max = Math.max(...selectedInt);
      if (index < min) {
        base = max;
      } else {
        base = min;
      }
      const newSelected = [];
      if (index < min) {
        for (let i = 0; i <= Math.abs(index - base); i++) {
          newSelected.push(tracks[base - i]._id);
        }
      } else if (index > max) {
        for (let i = 0; i <= Math.abs(index - base); i++) {
          newSelected.push(tracks[base + i]._id);
        }
      }
      this.selected = newSelected;
    },
    isLeftClick: e => e.button === 0,
    isRightClick: e => e.button === 2
  },
  mounted() {
    document
      .getElementsByClassName("v-list")[0]
      .parentElement.classList.add("vv-list");
  },
  created() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  },
  destroyed() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
});
</script>
