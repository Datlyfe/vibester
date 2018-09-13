<template>
  <div class="empty animated fadeIn">
    <div class="msg">
      <i class="fa fa-info"></i>
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
