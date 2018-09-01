export default {
  playlist: (options: any) => {
    return {
      path: `playlist/${options.id}/tracks?output=jsonp&index=${options.index}`
    };
  },
  search: (options: any) => {
    return {
      path: `search?q=${options.term}&output=jsonp&index=${options.index}`
    };
  }
};
