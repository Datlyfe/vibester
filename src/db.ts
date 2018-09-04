import Dexie from "dexie";
const db = new Dexie("songsdb");
db.version(1).stores({
  playlists: "++id,name",
  songs: "++id,title"

});

export default db;
