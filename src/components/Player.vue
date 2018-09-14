<template>
  <div  class="player">
    <!-- HIDDEN AUDIO TAG -->
    <audio autoplay crossorigin="anonymous" style="display:none" ref="audio" :src="song.src"></audio>
    <!-- CONTROLS -->
    <div class="controls">
      <i :class="{'deactivate':!isLocal}" @click="prev" class="fa fa-backward"></i>
      <i @click="play" v-if="!playing" class="fa fa-play"></i>
      <i @click="pause" v-if="playing" class="fa fa-pause"></i>
      <i :class="{'deactivate':!isLocal}" @click="next" class="fa fa-forward"></i>
    </div>
    <!-- SONG COVER -->
    <div :style="coverStyle" class="cover"></div>

    <!-- PLAYER BODY -->
    <div class="player-body">
      <div class="text">
        <!-- TITLE -->
        <span class="title">{{song.title}} - </span>
        <!-- ARTIST -->
        <span class="artist">{{song.artist}}</span>
        <!-- LOOP -->
        <svgicon @click="handleLoop(true)" v-if="!loop" class="loop" icon="repeat" width="25" height="25" color="#fff"></svgicon>
        <svgicon @click="handleLoop(false)" v-else class="loop1" icon="repeatone" width="25" height="25" color="#fff"></svgicon>
        <!-- SHUFFLE -->
        <svgicon v-if="isLocal" @click="handleShuffle" :class="{'active-shuffle':shuffle}" class="shuffle" icon="shuffle" width="25" height="25" color="#fff"></svgicon>
        <!-- VOLUME -->
        <span class="volume">
          <i @click="unmute" v-if="volumeLevel==0" class="fa fa-volume-off"></i>
          <template v-else >
            <i @click="mute" v-if="volumeLevel<500" class="fa fa-volume-down"></i>
            <i @click="mute" v-else class="fa fa-volume-up"></i>
          </template>

          <input class="volume_range animated fadeIn" @input="changeVolume" type="range"  step="10" title="volume" min="0" max="1000"  :value="volumeLevel">
        </span>
        <!-- SEPERATOR -->
        <span style="flex:1"></span>
        <!-- TIME/DURATION -->
        <span v-if="isLocal" class="time">{{currentTime}} / {{duration}}</span>
        <span class="time" v-else>{{currentTime}} / 0:30</span>
      </div>
      <!-- PROGRESS BAR -->
      <progress class="progress-bar" @click="handleProgress" :value="value" max="1" ref="progress"></progress>
    </div>
    <!-- REF LINKS -->
    <div class="links"></div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { shorten, formatSecondsAsTime } from "@/services/helpers";
import fallbackImage from "@/assets/img/disk.jpg";
import "@/compiled-icons";
import { ISong } from "@/models/song";
import {
  PLAY_NEXT_SONG,
  PLAY_PREV_SONG,
  PLAY_RANDOM_SONG,
  NEW_SONG_NOTIF
} from "@/types/actionTypes";

// import { Notification } from 'electron';
export default Vue.extend({
  props: ["song", "isLocal", "inPlaylist"],
  data() {
    return {
      playing: true,
      duration: "0:00",
      currentTime: "0:00",
      value: 0,
      savedVolume: 0,
      checked: false,
      loop: false,
      shuffle: false
    };
  },
  computed: {
    audio(): HTMLAudioElement {
      return this.$refs.audio as HTMLAudioElement;
    },
    coverStyle() {
      return { backgroundImage: `url(${this.song.cover})` };
    },
    volumeLevel() {
      return this.$store.state.volumeLevel * 1000;
    }
  },
  methods: {
    formatSecondsAsTime,
    shorten,
    handleLoop(loop) {
      this.loop = loop;
    },
    handleShuffle() {
      this.shuffle = !this.shuffle;
    },
    play() {
      this.playing = true;
      this.audio.play();
    },
    rePlay() {
      this.audio.currentTime = 0;
      this.play();
    },
    pause() {
      this.audio.pause();
      this.playing = false;
    },
    stop() {
      this.pause();
      this.audio.currentTime = 0;
    },
    mute() {
      this.savedVolume = this.audio.volume;
      (this.audio as HTMLAudioElement).volume = 0;
      this.$store.commit("setVolumeLevel", 0);
    },
    unmute() {
      (this.audio as HTMLAudioElement).volume = this.savedVolume;
      this.$store.commit("setVolumeLevel", this.savedVolume);
    },
    noImage(e: any) {
      e.target.src = fallbackImage;
    },
    handleProgress(e: any) {
      var percent = e.offsetX / e.target.offsetWidth;
      this.audio.currentTime = percent * this.audio.duration;
    },
    changeVolume(e: any) {
      let volumeLevel = parseInt(e.target.value) / 1000;
      this.audio.volume = volumeLevel;
      this.$store.commit("setVolumeLevel", volumeLevel);
    },
    next() {
      this.isLocal &&
        (!this.shuffle
          ? this.$store.dispatch(PLAY_NEXT_SONG, {
              id: this.song.id,
              inPlaylist: this.inPlaylist
            })
          : this.$store.dispatch(PLAY_RANDOM_SONG, {
              inPlaylist: this.inPlaylist
            }));
    },
    prev() {
      this.isLocal &&
        (!this.shuffle
          ? this.$store.dispatch(PLAY_PREV_SONG, {
              id: this.song.id,
              inPlaylist: this.inPlaylist
            })
          : this.$store.dispatch(PLAY_RANDOM_SONG, {
              inPlaylist: this.inPlaylist
            }));
    }
  },
  watch: {
    song: {
      immediate: true,
      handler(to: ISong, from) {
        if (from && to.id === from.id) return;
        this.$store.commit("setPlaying", to);
        this.playing = true;

        this.$store.dispatch(NEW_SONG_NOTIF, {
          cover: to.cover,
          title: to.title,
          artist: to.artist
        });
      }
    }
  },
  mounted() {
    this.audio.volume = this.$store.state.volumeLevel;
    this.audio.onloadedmetadata = () =>
      (this.duration = formatSecondsAsTime(
        Math.floor(this.audio.duration).toString()
      ));
    this.audio.ontimeupdate = (e: any) => {
      this.currentTime = formatSecondsAsTime(
        Math.floor(this.audio.currentTime).toString()
      );
      let time = e.target.currentTime / e.target.duration;
      time = time == 1 ? 0 : time;
      time = time ? time : 0;
      this.value = time;
    };
    this.audio.onended = () => {
      this.value = 0;
      this.currentTime = "0:00";
      this.playing = false;
      this.loop ? this.rePlay() : this.next();
    };
    // CONFLICT : activated when renaming a playlist
    // document.addEventListener("keydown", e => {
    //   if (e.keyCode == 32) {
    //     this.playing ? this.pause() : this.play();
    //   }
    // });
  },
  beforeDestroy() {
    this.audio.remove();
  }
});
</script>
