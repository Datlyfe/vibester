import Vue from "vue";
declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    asyncComputed?: any;
    resource?: string;
  }
}

declare const __static: string;