import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { format as formatUrl } from 'url';
import { ChildProcess, spawn } from 'child_process';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  const window = new BrowserWindow({ webPreferences: { nodeIntegration: true } });

  if (isDevelopment) {
    window.webContents.openDevTools();
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
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

let childNodeCG: ChildProcess | undefined;

ipcMain.on('start-button', (event) => {
  if (childNodeCG === undefined) {
    childNodeCG = spawn('node', ['index.js'], {
      cwd: path.join(process.cwd(), 'vendor', 'nodecg')
    });
    event.returnValue = 'Success';
  } else {
    event.returnValue = 'Fail';
  }
});

ipcMain.on('stop-button', (event) => {
  if (childNodeCG !== undefined) {
    childNodeCG.kill();
    childNodeCG = undefined;
    event.returnValue = 'Success';
  } else {
    event.returnValue = 'Fail';
  }
});
