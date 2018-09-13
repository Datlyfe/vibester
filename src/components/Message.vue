<template>
  <div class="empty animated fadeIn">
    <div class="msg">
      <span>{{msg}}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["msg", "subMsg"]
});
</script>
