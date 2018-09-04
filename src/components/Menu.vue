<template>
  <div class="menu">
    <!-- Logo -->
    <div class="logo">
      <img class="logo__img" src="@/assets/img/logo.png" alt="Logo">
      <h1 class="logo__label">Vibester</h1>
    </div>
    <!-- NAVIGATION -->
    <nav class="nav"> 
      <h3 class="nav__label">Browse Music</h3>
      <ul class="nav__list">
        <router-link tag="li" to="/" class="nav__list__item active-bar">
          <i class="fa fa-compass" ></i>          
          <span  class="nav__list__link">Discover</span>          
        </router-link>
        <router-link tag="li" to="/files" class="nav__list__item active-bar">
          <i class="fa fa-folder-open" ></i>          
          <span  class="nav__list__link">Local Tunes</span>          
        </router-link>
        <router-link :class="{'router-link-exact-active':$route.name=='playlist'}" tag="li" to="/playlists" class="nav__list__item active-bar">
          <i class="fa fa-list-ul" ></i>          
          <span  class="nav__list__link">Playlists</span>          
        </router-link>
      </ul>
    </nav>
  </div>
</template>
