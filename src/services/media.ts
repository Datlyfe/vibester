import { files as recursiveFiles } from "node-dir";
import path from "path";
import * as mm from "music-metadata";
import * as util from "util";
import * as fs from "fs";
import { ISong } from "@/models/song";

export const stat = util.promisify(fs.stat);

// CHECK IF FILE IS PLAYBALE
export const isPlayableMedia = (filepath: string): boolean => {
  return ["m4a", "mp3"].includes(path.extname(filepath).substring(1));
};

// READ DIRECTORY FILES
export const loadMediaFiles = (directory: string): Promise<string[]> => {
  return new Promise(resolve => {
    recursiveFiles(directory, (err, files: string[]) => {
      if (err || !files) resolve(null);
      else {
        let mediaFiles = files.filter(isPlayableMedia);
        resolve(mediaFiles);
      }
    });
  });
};

// PARSE DURATION FROM SECONDS TO STRING
export const parseDuration = (duration: number | null): string => {
  if (duration !== null) {
    let hours = Math.trunc(duration / 3600);
    let minutes = Math.trunc(duration / 60) % 60;
    let seconds = Math.trunc(duration) % 60;

    const hoursStringified = hours < 10 ? `0${hours}` : hours;
    const minutesStringified = minutes < 10 ? `0${minutes}` : minutes;
    const secondsStringified = seconds < 10 ? `0${seconds}` : seconds;

    let result = hoursStringified > 0 ? `${hoursStringified}:` : "";
    result += `${minutesStringified}:${secondsStringified}`;

    return result;
  }
  return "00:00";
};

// SONG DURATION FROM FILE
export const getAudioDuration = (trackPath: string): Promise<number> => {
  const audio = new Audio();

  return new Promise((resolve, reject) => {
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });

    audio.addEventListener("error", (e: any) => {
      const message = `Error getting audio duration: (${
        e.currentTarget.error.code
      }) ${trackPath}`;
      reject(new Error(message));
    });

    audio.preload = "metadata";
    audio.src = encodeURI(trackPath).replace("#", "%23");
  });
};

// PARSE BASE64 DATA TO IMAGE URL FORMAT
export const parseBase64 = (format: string, data: string): string => {
  return `data:image/${format};base64,${data}`;
};

// PARSE FILE PATH TO URI
export const parseUri = (uri: string): string => {
  const root = process.platform === "win32" ? "" : path.parse(uri).root;
  const location = uri
    .split(path.sep)
    .map((d, i) => (i === 0 ? d : encodeURIComponent(d)))
    .reduce((a, b) => path.join(a, b));
  return `file://${root}${location}`;
};

export const getDefaultMetadata = (): ISong => ({
  album: "Unknown",
  artist: "Unknown artist",
  duration: null,
  genre: null,
  path: "",
  cover: "",
  playCount: 0,
  title: "Unknown",
  year: null
});

export const getMetadata = async (trackPath: string): Promise<ISong> => {
  const defaultMetadata = getDefaultMetadata();
  const basicMetadata: ISong = {
    ...defaultMetadata,
    path: trackPath
  };

  try {
    const stats = await stat(trackPath);
    const data = await mm.parseFile(trackPath, {
      native: true,
      skipCovers: true,
      fileSize: stats.size,
      duration: true
    });

    const parsedData = parseMusicMetadata(data, trackPath);

    const metadata: ISong = {
      ...defaultMetadata,
      ...parsedData,
      path: trackPath
    };

    if (!metadata.duration) {
      try {
        let duration = await getAudioDuration(trackPath);
        metadata.duration = parseDuration(duration);
      } catch (err) {
        console.warn(
          `An error occured while getting ${trackPath} duration: ${err}`
        );
      }
    }

    return metadata;
  } catch (err) {
    console.warn(
      `An error occured while reading ${trackPath} id3 tags: ${err}`
    );
  }
  return basicMetadata;
};

// FETCH SONG COVER FROM FILE PATH
export const fetchCover = async (trackPath: string): Promise<string | null> => {
  if (!trackPath) {
    return null;
  }
  const data = await mm.parseFile(trackPath);
  const picture = data.common.picture && data.common.picture[0];

  if (picture) {
    return parseBase64(picture.format, picture.data.toString("base64"));
  }
  return null;
};

// JS PLEASE...
export const upper = (string: string) => {
  return string.replace(/^\w/, s => s.toUpperCase());
};

// PARSE SONG METADATA
export const parseMusicMetadata = (
  data: mm.IAudioMetadata,
  trackPath: string
): Partial<ISong> => {
  const { common, format } = data;
  const metadata = {
    title: upper(common.title) || upper(path.parse(trackPath).base),
    album: common.album,
    artist: common.artist,
    duration: parseDuration(format.duration),
    genre: common.genre || ["-"], // not sure about this...
    year: common.year
  };
  return metadata;
};

// SORT STRING[]
export const simpleSort = (array: ISong[], sorting: "asc" | "desc") => {
  if (sorting === "asc") {
    array.sort((a, b) => (a.title > b.title ? 1 : -1));
  } else if (sorting === "desc") {
    array.sort((a, b) => (b.title > a.title ? -1 : 1));
  }
  const result: ISong[] = [];
  array.forEach(item => {
    if (!result.includes(item)) result.push(item);
  });
  return result;
};
