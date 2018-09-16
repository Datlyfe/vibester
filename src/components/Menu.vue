<template>
  <div class="menu">
    <!-- Logo -->
    <div class="logo">
      <h1 class="logo__label">Vibester</h1>
      <!-- <img class="logo__img" src="@/assets/img/logo.png" alt="Logo"> -->
    </div>
    <!-- NAVIGATION -->
    <nav class="nav"> 
      <h3 class="nav__label">Browse Music</h3>
      <ul class="nav__list">
        <router-link v-for="item in items" :key="item.name" tag="li" :to="item.to" class="nav__list__item">
          <div class="active-bar"></div>
          <i :class="[item.icon]" ></i>          
          <span class="nav__list__link">{{item.name}}</span>          
        </router-link>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      items: [
        { name: "Library", to: "/", icon: "fa fa-music" },
        { name: "Discover", to: "/discover", icon: "fa fa-compass" },
        { name: "Playlists", to: "/playlists", icon: "fa fa-bars" },
        { name: "Most Played", to: "/most-played", icon: "fa fa-bolt" },
        { name: "Settings", to: "/settings", icon: "fa fa-gear" }
      ]
    };
  }
});
</script>
