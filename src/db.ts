import Dexie from "dexie";
const db = new Dexie("songsdb");
db.version(1).stores({
  songs: "++id,title",
  playlists: "++id,name"
});

export default db;
