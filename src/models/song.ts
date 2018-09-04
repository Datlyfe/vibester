export interface ISong {
  id?: number;
  title: string;
  album: string;
  artist: string;
  cover: string;
  duration: string | number;
  genre: string[];
  year: number;
  path?: string;
  playCount?: number;
}
