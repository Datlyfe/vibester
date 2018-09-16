"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
  require("module").globalPaths.push(process.env.NODE_MODULES_PATH);
}

let mainWindow: any;

protocol.registerStandardSchemes(["app"], { secure: true });
function createMainWindow() {
  const window = new BrowserWindow({
    width: 1605,
    minWidth: 1500,
    minHeight: 840,
    resizable: true,
    icon: path.join(__static, "logo.png"),
    webPreferences: { webSecurity: false }
  });

  if (isDevelopment) {
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
  } else {
    createProtocol("app");
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  mainWindow = createMainWindow();
});

ipcMain.on("setFolder", event => {
  dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] }, path => {
    if (path) {
      event.sender.send("setFolder", path[0]);
    }
  });
});
