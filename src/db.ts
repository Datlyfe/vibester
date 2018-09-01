import Dexie from "dexie";
const db = new Dexie("songsdb");
db.version(1).stores({
  songs: "++id,title",
  likes: "++id,title",
  playlists:"++id"
});

export default db;
