<template>
  <div class="main">
    <router-view/>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>


<style lang="scss" scoped>
.main {
  position: relative;
  grid-row: 1/2;
  grid-column: 2/-1;
  background: #232323;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 10rem;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 8px #00000033;
  }
  &::-webkit-scrollbar {
    width: 3px;
    background-color: #303030;
  }
  &::-webkit-scrollbar-thumb {
    background: #c9c9c9;
  }
}
</style>
