<template>
  <div class="playlists animated fadeIn">
    <div class="side">
      <Header title="Playlists">
        <div class="actions" slot="actions">
          <i class="fa fa-plus"></i>
        </div>
      </Header>
    </div>
    <div class="body">

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
export default Vue.extend({
  components: {
    Header
  }
});
</script>



<style lang="scss" scoped>
.side {
  background: #2e2e2e;
  padding: 3rem 2rem;
  width: 300px;
  border-right: 1px solid #333333;
}
.body {
  flex: 1;
}
</style>
