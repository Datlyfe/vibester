import jsonp from "fetch-jsonp";
import cache from "../cache";
import { getIndex } from "@/services/helpers";
export default {
  install: (Vue: any, { endpoint = "", resources = {} }) => {
    Vue.prototype.$getResource = function(method: string, options: any) {
      // Get resource name form component options
      let name = this.$options.resource;
      // If no resource is found return
      if (!name || !resources[name] || !resources[name][method]) return;
      // Get resource path
      const path = resources[name][method](options);
      // Create url from path and endpoint
      const url = endpoint + path;
      // Check the cache and return data if found
      if (cache.has(url)) return cache.get(url);
      // Make the api call
      return jsonp(url)
        .then(res => res.json())
        .then(res =>
          cache.set(
            {
              data: res.data,
              next: getIndex(res.next),
              prev: getIndex(res.prev)
            },
            url
          )
        );
    };
  }
};
