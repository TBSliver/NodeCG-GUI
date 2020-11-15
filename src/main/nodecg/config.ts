import { ipcMain } from 'electron';
import { nodecgPath } from '../util';
import * as fs from 'fs';
import { ipcCommands, ipcMessages } from 'common/ipc-messages';
import { messageMainWindow } from '../main-window';

let configCache: any = {};

interface ConfigData {
  [key: string]: any;
}

export function readConfig(confFile: string) {
  let config: ConfigData = {};

  if (!fs.existsSync(nodecgPath('cfg'))) {
    console.log("cfg dir does not exist, creating");
    fs.mkdirSync(nodecgPath('cfg'));
  }

  let confPath = nodecgPath('cfg', `${confFile}.json`);
  try {
    const rawConfig = fs.readFileSync(confPath);
    config = JSON.parse(rawConfig.toString());
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('File not found!', confPath);
    } else {
      throw e;
    }
  }
  configCache[confFile] = config;
  return config;
}

function setConfig(confFile: string, config: object) {
  readConfig(confFile);

  let confPath = nodecgPath('cfg', `${confFile}.json`);
  try {
    const newConfig = {
      ...configCache[confFile],
      ...config
    }
    console.log(newConfig);
    console.log(confPath);
    const output = JSON.stringify(newConfig);
    fs.writeFileSync(confPath, output);
  } catch (e) {
    console.log(e);
  }
  messageMainWindow(ipcMessages.configUpdated, confFile);

}

function readConfigListener(e: Electron.IpcMainEvent, confFile: string) {
  e.returnValue = readConfig(confFile);
}

function setConfigListener(e: Electron.IpcMainEvent, args: any[]) {
  const [confFile, config] = args;
  console.log(args);
  setConfig(confFile, config);
}

export function setupConfigIpcListeners() {
  ipcMain.on(ipcCommands.getConfig, readConfigListener);
  ipcMain.on(ipcCommands.setConfig, setConfigListener);
}