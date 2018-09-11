import * as os from "os";
import { ISong } from "@/models/song";

// check if CtrlKey is pressed
export const isCtrlKey = (e: any): boolean => {
  const isMacOS = os.platform() === "darwin";

  return (isMacOS && e.metaKey) || (!isMacOS && e.ctrlKey);
};

export const isLeftClick = e => {
  return e.button === 0;
};
export const isRightClick = e => {
  return e.button === 2;
};

export const parseSong = (song: any): Partial<ISong> => {
  return {
    id: song.id as number,
    title: song.title,
    album: song.album.title as string,
    cover: song.album.cover_medium as string,
    artist: song.artist.name as string,
    src: song.preview as string
  } as Partial<ISong>;
};

export const getSelected = (selected, tracks, index) => {
  const selectedInt = [];
  for (let i = 0; i < tracks.length; i++) {
    if (selected.includes(tracks[i].id)) {
      selectedInt.push(i);
    }
  }
  let base;
  const min = Math.min(...selectedInt);
  const max = Math.max(...selectedInt);
  if (index < min) {
    base = max;
  } else {
    base = min;
  }
  const newSelected = [];
  if (index < min) {
    for (let i = 0; i <= Math.abs(index - base); i++) {
      newSelected.push(tracks[base - i]._id);
    }
  } else if (index > max) {
    for (let i = 0; i <= Math.abs(index - base); i++) {
      newSelected.push(tracks[base + i]._id);
    }
  }
  return newSelected;
};
