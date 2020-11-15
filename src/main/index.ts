import { app } from 'electron';
import { setupNodeCGIpcListeners } from './nodecg';
import { createTray } from './menu';
import { openMainWindow } from './main-window';
import { setupConfigIpcListeners } from './nodecg/config';

setupNodeCGIpcListeners();
setupConfigIpcListeners();

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // Do nothing! tray manages it
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  openMainWindow();
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  openMainWindow();
  createTray();
});