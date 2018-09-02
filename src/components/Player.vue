<template>
  <div class="player">
    <!-- HIDDEN AUDIO TAG -->
    <audio autoplay crossorigin="anonymous" style="display:none" ref="audio" :src="song.src"></audio>
    <!-- CONTROLS -->
    <div class="controls">
      <i @click="prev" class="fa fa-backward"></i>
      <i @click="play" v-if="!playing" class="fa fa-play"></i>
      <i @click="pause" v-if="playing" class="fa fa-pause"></i>
      <i @click="next" class="fa fa-forward"></i>
    </div>
    <!-- SONG COVER -->
    <div :style="coverStyle" class="cover"></div>

    <!-- SONG INFO -->
    <div class="info">
      <div class="text">
        <span class="title">{{song.title}} - </span>
        <span class="artist">{{song.artist}}</span>
        <span v-if="isLocal" class="time">{{currentTime}} / {{duration}}</span>
        <span class="time" v-else>{{currentTime}} / 0:30</span>
      </div>
      <!-- PROGRESS BAR -->
      <progress class="progress-bar" @click="handleProgress" :value="value" max="1" ref="progress"></progress>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { shorten, formatSecondsAsTime } from "@/services/helpers";
import fallbackImage from "@/assets/img/disk.jpg";
export default Vue.extend({
  props: ["song", "isLocal"],
  data() {
    return {
      playing: true,
      duration: "0:00",
      currentTime: "0:00",
      value: 0,
      checked: false
    };
  },
  computed: {
    audio(): HTMLAudioElement {
      return this.$refs.audio as HTMLAudioElement;
    },
    coverStyle() {
      return { backgroundImage: `url(${this.song.cover})` };
    }
  },
  methods: {
    formatSecondsAsTime,
    shorten,
    play() {
      this.playing = true;
      this.audio.play();
    },
    pause() {
      this.audio.pause();
      this.playing = false;
    },
    stop() {
      this.pause();
      this.audio.currentTime = 0;
    },
    noImage(e: any) {
      e.target.src = fallbackImage;
    },
    handleProgress(e: any) {
      var percent = e.offsetX / e.target.offsetWidth;
      this.audio.currentTime = percent * this.audio.duration;
    },
    changeVolume(e: any) {
      this.audio.volume = parseInt(e.target.value) / 1000;
    },
    next() {
      this.isLocal &&
        this.$store.dispatch("PLAY_NEXT_SONG", { id: this.song.id });
    },
    prev() {
      this.isLocal &&
        this.$store.dispatch("PLAY_PREV_SONG", { id: this.song.id });
    }
  },
  mounted() {
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
      // TODO Play next Song
      if (this.isLocal) {
        this.$store.dispatch("PLAY_NEXT_SONG", { id: this.song.id });
      }
    };
  },
  beforeDestroy() {
    this.audio.remove();
  }
});
</script>


<style lang="scss" scoped>
.player {
  margin-left: 250px;
  display: flex;
  align-items: center;
  min-width: 1000px;
  height: 100%;
  padding: 0 1rem;
}

.controls {
  margin: 0 2rem;
  width: 150px;
  justify-content: center;
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  height: 100%;
  .fa {
    cursor: pointer;
    margin: 0;
    font-size: 2rem !important;
  }
}

.cover {
  height: 100px;
  width: 100px;
  margin: 0 2rem;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.info {
  width: 600px;
  margin: 0 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.title {
  color: white;
}
.artist {
  color: silver;
}
.time {
  margin-left: auto;
  margin-left: auto;
}

.progress-bar {
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  border-radius: 200px;
}

.progress-bar[value] {
  -webkit-appearance: none;
  appearance: none;
  background-color: darkgray;
  color: darkgray;
  height: 5px;
}

.progress-bar[value]::-webkit-progress-bar {
  background-color: rgb(226, 226, 226);
}

.progress-bar::-webkit-progress-value {
  background-color: rgb(148, 28, 52);
}
</style>

