<template>
  <div ref="list" class="table animated fadeIn">
    <div v-if="songs.length>0" class="row header">
      <div class="cell">Title</div>
      <div class="cell">Artist</div>
      <div class="cell">Album</div>
      <div class="cell">Duration</div>
    </div>

    <div :class="{'selected':selected.includes(song.id)}" tabindex="-1" @contextmenu="showContextMenu" @mousedown="selectSong($event,song.id,index)"  @dblclick="cue(song)" v-for="(song,index) in songs" class="row" :key="song.id">
      <div class="cell">{{song.title}}</div>
      <div class="cell">{{song.artist}}</div>
      <div class="cell">{{song.album}}</div>
      <div class="cell">{{song.duration}}</div>
    </div>
</div>
</template>


<script lang="ts">
import Vue from "vue";
import bus from "@/services/bus";
import { Song } from "@/models/song";
import electron from "electron";
import { isCtrlKey } from "@/services/utils";
const { shell, remote } = electron;
const { Menu } = remote;
export default Vue.extend({
  data() {
    return {
      selected: []
    };
  },
  props: ["songs"],
  methods: {
    cue(song: Song) {
      bus.$emit("newCue", song, true);
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
      if (this.$refs.list && !this.$refs.list.contains(e.target)) {
        this.selected = [];
      }
    },
    showContextMenu() {
      const selectedCount = this.selected.length;
      const template: electron.MenuItemConstructorOptions[] = [
        {
          label:
            selectedCount > 1
              ? `${selectedCount} Tunes selected`
              : `${selectedCount} Tune selected`,
          enabled: false
        },
        {
          label: "Play Next",
          click: () =>
            this.$store.dispatch("ADD_TO_QUEUE", {
              songs: this.selected,
              immediate: true
            })
        },
        {
          label: "Add to Queue",
          click: () =>
            this.$store.dispatch("ADD_TO_QUEUE", {
              songs: this.selected,
              immediate: false
            })
        },
        {
          label: "Add to playlist",
          click: () => console.log(this.selected)
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
  created() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  },
  destroyed() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
});
</script>


<style lang="scss" scoped>
.table {
  width: 100%;
  display: table;
  margin: 2rem 0;
  animation-duration: 0.4s;
}
.row {
  display: table-row;
  backface-visibility: hidden;
  width: 100%;
  transition: all 0.2s !important;
}
.cell {
  display: table-cell;
  backface-visibility: hidden;
}
.row .cell {
  font-size: 1.6rem;
  color: darkgray;
  padding: 0.5rem;
  font-weight: 400 !important;
}
.row.header .cell {
  font-size: 1.8rem;
  color: white;
  font-weight: 700;
}

.row:hover {
  cursor: pointer;
  .cell {
    color: white !important;
  }
}
.row.selected {
  background-color: var(--primary);
  .cell {
    color: white !important;
  }
}
.row.header:hover {
  background-color: unset;
  cursor: unset;
  transform: unset;
}

.notunes {
  color: #f0e6e8;
  margin: 0 auto;
  font-weight: 400;
  padding: 0.25rem 0;
  font-size: 1.8rem;
  .fa {
    font-size: 1.8rem !important;
  }
}
</style>
