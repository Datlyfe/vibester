<template>
    <div class="header">
      <h1 class="header__label">{{t}}</h1>
      <slot name="info"></slot>
      <slot name="search"></slot>
      <slot name="actions"></slot>
    </div>
</template>


<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      t: this.title
    };
  },
  props: {
    title: {
      type: String,
      required: false
    },
    cap: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  mounted() {
    if (this.cap) {
      this.t = this.title && (this.title as String).toUpperCase();
    }
  }
});
</script>


<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  &__label {
    color: white;
    font-weight: 400;
    padding: 0.25rem 0;
    font-size: 1.8rem;
    letter-spacing: 0.2rem;
  }
  .small {
    color: #686868;
    transition: all 0.2s;
    font-size: 1.6rem;
    letter-spacing: unset;
    flex: unset;
    margin-left: 2rem;
    text-transform: capitalize;
    &:hover {
      color: white;
    }
  }
  .actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    .fa-plus {
      color: darkgray;
      cursor: pointer;
      font-weight: 300;
      font-size: 1rem;
      border: 1px solid;
      position: relative;
      right: -4px;
      padding: 0.6rem 0.7rem;
      &:hover {
        color: ghostwhite;
      }
    }
    .delete {
      cursor: pointer;
      text-transform: capitalize;
      font-size: 1.6rem;
      margin: 0 0.5rem;
      color: darkgray;
      .fa {
        margin: 0 0.5rem;
      }
      &:hover {
        color: ghostwhite;
      }
    }

    .rename {
      cursor: pointer;
      text-transform: capitalize;
      font-size: 1.6rem;
      margin: 0 0.5rem;
      color: darkgray;
      .fa {
        margin: 0 0.5rem;
      }
      &:hover {
        color: ghostwhite;
      }
    }
  }
}
</style>
