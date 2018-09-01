export const shorten = (text: string, n: number) => {
  return text.length > n ? text.substr(0, n - 1) + "..." : text;
};
export const formatSecondsAsTime = secs => {
  let hr = Math.floor(secs / 3600);
  let min = Math.floor((secs - hr * 3600) / 60);
  let sec = Math.floor(secs - hr * 3600 - min * 60);

  if (sec < 10) {
    sec = `0${sec}` as any;
  }

  return `${min}:${sec}`;
};

export const getIndex = (url: string) => {
  if (!url) return null;
  let regex = new RegExp("[?&]index(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
