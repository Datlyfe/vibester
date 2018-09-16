import { ISong } from "@/models/song";
export interface IPlaylist {
  id?: number;
  name: string;
  createdAt?: string;
  songs: Array<ISong>;
  cover?: Array<string>;
  coverPaths?: Array<string>;
}
