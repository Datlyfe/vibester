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
  data(){
    return{
      t:this.title
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    cap:{
      type:Boolean,
      default:true
    }
  },
  mounted(){
    if(this.cap){
      this.t=(this.title as String).toUpperCase();
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
    letter-spacing: 0.1rem;
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
    .fa-plus {
      transition: all 0.3s;
      color: darkgray;
      cursor: pointer;
      font-weight: 300;
      font-size: 1.4rem;
      border: 1px solid darkgray;
      padding: 0.4rem 0.6rem;
      &:hover {
        color: white;
        border-color: white;
      }
    }
  }
}
</style>
