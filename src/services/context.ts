import store from "@/store";
import electron from "electron";
import { IPlaylist } from "@/models/playlist";
const { shell, remote } = electron;
const { Menu } = remote;

export const createPlaylistSubMenu = songsIds => {
  let playlistSubMenu: electron.MenuItemConstructorOptions[] = [
    {
      label: "New Playlist",
      click: () => {
        store.dispatch("NEW_PLAYLIST").then(({ id }: IPlaylist) => {
          store.dispatch("ADD_TO_PLAYLIST", {
            songsIds,
            playlistId: id
          });
        });
      }
    },
    { type: "separator" }
  ];
  store.state.playlists.forEach((p: IPlaylist) => {
    playlistSubMenu.push({
      label: p.name,
      click: () =>
        store.dispatch("ADD_TO_PLAYLIST", {
          songsIds,
          playlistId: p.id
        })
    });
  });
  return playlistSubMenu;
};

export const createTuneListContext = songsIds => {
  const n = songsIds.length;
  const template: electron.MenuItemConstructorOptions[] = [
    {
      label: n > 1 ? `${n} Tunes Selected` : `${n} Tune Selected`,
      enabled: false
    },
    {
      label: "Add to playlist",
      submenu: createPlaylistSubMenu(songsIds)
    }
  ];
  return template;
};
