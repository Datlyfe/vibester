export default (() => {
  let store = {};
  return {
    all: () => store,
    has: (url:string):boolean => !!store[url],
    set: (data:any, url:string) => {
      store[url] = JSON.stringify(data);
      return Promise.resolve(data);
    },
    get: (url:string):any => JSON.parse(store[url])
  };
})();
