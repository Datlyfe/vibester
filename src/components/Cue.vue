<template>
  <div class="cue">
    <ul class="queue">
      <div v-for="song in queue" :key="song.id" :style="coverStyle(song.cover)" class="cover_queue animated slideInRight"></div>
    </ul>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  computed: {
    queue() {
      console.log(this.$store.state.localSongsQueue);
      return this.$store.state.localSongsQueue;
    }
  },
  methods: {
    coverStyle(cover) {
      return { backgroundImage: `url(${cover})` };
    }
  }
});
</script>



<style lang="scss" scoped>
.cue {
  grid-row: 1/2;
  grid-column: 3/4;
  background: var(--primary);
  overflow-y: auto;
  overflow-x: hidden;
}

.cue-song {
  animation-duration: 0.5s;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.7rem;
  img {
    width: 250px;
    height: 250px;
    object-fit: cover;
    padding: 0.5rem;
    border-radius: 50%;
    background: #d8d6d6;
  }

  .spin {
    -webkit-animation: spin 4s linear infinite;
    -moz-animation: spin 4s linear infinite;
    animation: spin 15s linear infinite;
  }

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .title {
    margin-top: 1.5rem;
    color: white;
    display: block;
  }
  .artist {
    color: #d8d6d6;
  }
}
.playing-label {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #e4e4e4;
}
</style>


