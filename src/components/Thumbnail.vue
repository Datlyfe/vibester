<template>
   <div class="thumbnail">
    <div class="item" v-for="cover of covers" :key="cover">
      <img :src="cover" alt="">
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["covers"]
});
</script>


<style lang="scss" scoped>
.thumbnail {
  width: 200px;
  height: 200px;
  display: grid;
  grid-template-rows: 100px 100px;
  grid-template-columns: 100px 100px;
}

.item {
  transition: all 0.2s;
  img {
    width: 100%;
  }
}
</style>


