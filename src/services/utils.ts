import * as os from "os";
import { ISong } from "@/models/song";

// check if CtrlKey is pressed
export const isCtrlKey = (e: any): boolean => {
  const isMacOS = os.platform() === "darwin";

  return (isMacOS && e.metaKey) || (!isMacOS && e.ctrlKey);
};

export const parseSong = (song: any): Partial<ISong> => {
  return {
    id: song.id as number,
    title: song.title,
    album: song.album.title as string,
    cover: song.album.cover_medium as string,
    artist: song.artist.name as string,
    src: song.preview as string
  } as  Partial<ISong> ;
};
