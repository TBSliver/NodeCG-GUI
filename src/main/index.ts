import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron';
import path from 'path';
import { format as formatUrl } from 'url';
import { ChildProcess, spawn } from 'child_process';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;
let nodecgWindow: BrowserWindow | undefined;
let childNodeCG: ChildProcess | undefined;

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

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // Do nothing! tray manages it
});

let tray: Tray;

function createTray() {
  tray = new Tray('static/logo.png');
  tray.setToolTip('NodeCG GUI');
  setTrayMenu();
}

function setTrayMenu() {
  if (tray === undefined) return;
  const menu = Menu.buildFromTemplate([
    { label: 'Controls', click: openMainWindow },
    { label: 'NodeCG Window', click: openNodecgWindow, enabled: childNodeCG !== undefined },
    {
      label: 'Open in Browser',
      click: () => shell.openExternal('http://localhost:9090'),
      enabled: childNodeCG !== undefined
    },
    { type: 'separator' },
    { role: 'quit' }
  ]);
  tray.setContextMenu(menu);
}

function openMainWindow() {
  if (mainWindow === undefined) {
    mainWindow = createMainWindow();
  }
  mainWindow.show();
}

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  openMainWindow();
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  openMainWindow();
  createTray();
});

ipcMain.on('get-start-status', (event) => {
  event.returnValue = childNodeCG !== undefined;
});

ipcMain.on('start-button', () => {
  if (childNodeCG === undefined) {
    childNodeCG = spawn('node', ['index.js'], {
      cwd: path.join(process.cwd(), 'vendor', 'nodecg')
    });
  }
  mainWindow?.webContents.send('start-status', true);
  setTrayMenu();
});

ipcMain.on('stop-button', () => {
  if (childNodeCG !== undefined) {
    childNodeCG.kill();
    childNodeCG = undefined;
  }
  mainWindow?.webContents.send('start-status', false);
  setTrayMenu();
});

function openNodecgWindow() {
  // No point opening if not available
  if (childNodeCG === undefined) return;
  if (nodecgWindow === undefined) {
    nodecgWindow = new BrowserWindow();
    // TODO port change on settings
    nodecgWindow.loadURL('http://localhost:9090').then();
    nodecgWindow.on('closed', () => nodecgWindow = undefined);
  }
  nodecgWindow.show();
}

ipcMain.on('open-nodecg', () => {
  openNodecgWindow();
});
