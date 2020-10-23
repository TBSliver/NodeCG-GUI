import { ipcMain } from 'electron';
import { nodecgPath } from './util';
import * as fs from 'fs';

ipcMain.on('sync-get-config', (event, args = []) => {
  let [ confType, confFile] = args;
  if (confType === 'core') {
    confFile = 'nodecg';
    console.log("reading core file");
  } else if (confType !== 'bundle') {
    console.log("Unrecognised confType");
    event.returnValue = {};
    return;
  }
  let confPath = nodecgPath('cfg', confFile);
  let config = {};
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
  event.returnValue = config;
})