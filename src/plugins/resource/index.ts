import jsonp from "fetch-jsonp";
import cache from "../cache";
import { getIndex } from "@/services/helpers";
export default {
  install: (Vue: any, { endpoint = "", resources = {} }) => {
    Vue.prototype.$getResource = function(method: string, options: any) {
      let name = this.$options.resource;
      if (!name || !resources[name] || !resources[name][method]) return;
      const { path } = resources[name][method](options);
      const url = endpoint + path;
      if (cache.has(url)) return cache.get(url);

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
