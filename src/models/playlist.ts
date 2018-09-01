import { Song } from '@/models/song';

export interface Playlist {
  name:string,
  createdAt?:string,
  songs:Array<Song>
}
