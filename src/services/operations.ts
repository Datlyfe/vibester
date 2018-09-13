import store from "@/store";
import { IPlaylist } from '@/models/playlist';
import { ISong } from '@/models/song';

export const getPlaylistById=(id:number) : IPlaylist=>{
  let p:IPlaylist = store.state.playlists.filter(p => p.id == id)[0];
  return p;
}

export const getSongFromPlaylistById =(songId:number,playlistId:number):ISong=>{
  let p = getPlaylistById(playlistId);
  let song = p.songs.filter(s=>s.id==songId)[0];
  return song;
}