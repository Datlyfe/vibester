<template>
  <div class="discover animated fadeIn">
    <!-- HEADER -->
    <Header title="Discover">
      <div class="search" slot="search">
        <i class="fa fa-search"></i>
        <input @keyup.enter="handleSearch" v-model="term" autocomplete="off" placeholder="Search" class="search__input" type="text">
      </div>
    </Header>
    <!-- GENRES -->
    <nav class="genres">
      <ul class="list">
        <li @click="handlePlaylist(genre)" v-for="genre in genres" :key="genre.id" class="item" :class="{active:genreId==genre.id}">
          <span class="link">{{genre.name}}</span>
        </li>
      </ul>
    </nav>
    <!-- PAGINATION -->
    <div class="paginator">
      <i :class="{deactive:!prev}" @click="goPrev" class="fa fa-chevron-left"></i>
      <span class="num">{{page}}</span>
      <i :class="{deactive:!next}" @click="goNext" class="fa fa-chevron-right"></i>
    </div>
    <!-- LOADER -->
    <div v-if="loading" class="loader"></div>
    <!-- FEED -->
    <Feed  v-show="!loading" :songs="feed"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Feed from "@/components/Feed.vue";
import Genres from "@/static/genres";
import Header from "@/components/Header.vue";
import { paginator } from "@/mixins";

export default Vue.extend({
  name: "Discover",
  resource: "Discover",
  mixins: [paginator],
  components: {
    Header,
    Feed
  },
  data() {
    return {
      feed: [],
      genres: Genres,
      genreId: 132,
      playlistId: 2098157264,
      loading: true,
      term: "",
      mode: "discover"
    };
  },
  methods: {
    goNext() {
      if (!this.next) return;
      this.mode == "search"
        ? this.search(this.next)
        : this.getPlaylist(this.playlistId, this.next);
      this.page++;
      console.log(this.page);
    },
    goPrev() {
      if (!this.prev) return;
      this.mode == "search"
        ? this.search(this.prev)
        : this.getPlaylist(this.playlistId, this.prev);
      this.page--;
    },
    handleSearch() {
      this.page = 1;
      this.genreId = -1;
      this.search();
    },
    handlePlaylist(genre) {
      this.genreId = genre.id;
      this.playlistId = genre.playlistId;
      this.page = 1;
      this.getPlaylist(genre.playlistId);
    },
    async search(index = 0) {
      this.mode = "search";
      this.loading = true;
      const { data, next, prev } = await this.$getResource("search", {
        term: this.term,
        index
      });
      this.feed = data;
      this.next = next;
      this.prev = prev;
      this.loading = false;
    },
    async getPlaylist(id, index) {
      this.mode = "discover";
      this.loading = true;
      const { data, next, prev } = await this.$getResource("playlist", {
        id,
        index
      });
      this.feed = data;
      this.next = next;
      this.prev = prev;
      this.loading = false;
    }
  },
  beforeMount() {
    this.getPlaylist(this.playlistId, this.next);
  }
});
</script>



<style lang="scss" scoped>
.genres {
  margin: 2rem 0;
}
.list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.item {
  margin-right:1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: capitalize;
  color: #686868;
  transition: all 0.2s;
  &:hover {
    color: white;
  }
}

.link {
  cursor: pointer;
}

.active {
  color: #db1d40;
  font-weight: 700;
  &:hover {
    color: #db1d40;
  }
}

.paginator {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .fa {
    cursor: pointer;
    color: darkgray;
    font-size: 1.6rem !important;
    padding: 0 0.5rem;
    margin: 0 0.5rem;
    transition: all 0.3s;
    &:hover {
      color: #db1d40;
    }
  }
  .num {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ececec;
    font-size: 1.6rem;
    font-weight: normal;
  }
  .deactive {
    color: #505050;
    cursor: unset;
    &:hover {
      color: #505050;
    }
  }
}
</style>
