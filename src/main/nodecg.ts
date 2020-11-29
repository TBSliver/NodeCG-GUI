import { ChildProcess, fork } from 'child_process';
import { nodecgPath } from './util';
import { BrowserWindow, ipcMain, shell } from 'electron';
import { messageMainWindow } from './main-window';
import { setTrayMenu } from './menu';
import { ipcCommands, ipcMessages, ipcStatus } from 'common/ipc-messages';
import URI from 'urijs';
import { readConfig } from './nodecg/config';

// Main NodeCG Process
let childNodeCG: ChildProcess | undefined;
let nodecgWindow: BrowserWindow | undefined;

export function hasRunningNodeCG(e?: Electron.IpcMainEvent) {
  const retVal = childNodeCG !== undefined;
  if (e !== undefined) e.returnValue = retVal;
  return retVal;
}

// Start Process
export function startNodeCG() {
  if (childNodeCG === undefined) {
    childNodeCG = fork('index.js', undefined, {
      cwd: nodecgPath(),
      env: { ELECTRON_RUN_AS_NODE: '1' }
    });
  }
  messageMainWindow(ipcMessages.nodeCGRunning, true);
  setTrayMenu();
}

// Stop Process
export function stopNodeCG() {
  if (childNodeCG !== undefined) {
    childNodeCG.kill();
    childNodeCG = undefined;
  }
  messageMainWindow(ipcMessages.nodeCGRunning, false);
  setTrayMenu();
}

// Restart Process
function restartNodeCG() {
  stopNodeCG();
  startNodeCG();
}

// Open NodeCG Window
export function openNodeCGWindow() {
  // No point opening if not available
  if (childNodeCG === undefined) return;
  if (nodecgWindow === undefined) {
    nodecgWindow = new BrowserWindow();
    nodecgWindow.loadURL(getNodeCGUrl()).then();
    nodecgWindow.on('closed', () => nodecgWindow = undefined);
  }
  nodecgWindow.show();
}

function openNodeCGBrowser() {
  shell.openExternal(getNodeCGUrl()).then();
}

function openNodeCGFolder() {
  shell.openExternal(nodecgPath()).then();
}

// Get Link for NodeCG instance
function getNodeCGUrl(e?: Electron.IpcMainEvent) {
  const config = readConfig('nodecg');
  const uri = new URI()
    .protocol('http')
    .hostname(config.host || 'localhost')
    .port(config.port || '9090');
  const retVal = uri.toString();
  if (e !== undefined) e.returnValue = retVal;
  return retVal;
}

export function setupNodeCGIpcListeners() {
  ipcMain.on(ipcStatus.nodeCGRunning, hasRunningNodeCG);
  ipcMain.on(ipcCommands.startNodeCG, startNodeCG);
  ipcMain.on(ipcCommands.stopNodeCG, stopNodeCG);
  ipcMain.on(ipcCommands.restartNodeCG, restartNodeCG);
  ipcMain.on(ipcCommands.openNodeCGWindow, openNodeCGWindow);
  ipcMain.on(ipcCommands.openNodeCGBrowser, openNodeCGBrowser);
  ipcMain.on(ipcCommands.openNodeCGFolder, openNodeCGFolder);
  ipcMain.on(ipcCommands.getExternalUrl, getNodeCGUrl);
}