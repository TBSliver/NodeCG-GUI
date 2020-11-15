// global reference to mainWindow (necessary to prevent window from being garbage collected)
import { BrowserWindow } from "electron";
import { format as formatUrl } from "url";
import path from "path";
import { isDevelopment } from './util';

let mainWindow: BrowserWindow | undefined;

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    width: 360,
    height: 540,
    autoHideMenuBar: true,
  });

  if (isDevelopment) {
    window.webContents.openDevTools({
      mode: 'detach'
    });
  }

  if (isDevelopment) {
    // noinspection JSIgnoredPromiseFromCall
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    // noinspection JSIgnoredPromiseFromCall
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('closed', () => {
    mainWindow = undefined;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

export function openMainWindow() {
  if (mainWindow === undefined) {
    mainWindow = createMainWindow();
  }
  mainWindow.show();
}

export function messageMainWindow(channel: string, ...args: any[]) {
  mainWindow?.webContents.send(channel, ...args);
}