import { Menu, shell, Tray } from 'electron';
import { hasRunningNodeCG, openNodeCGWindow, startNodeCG, stopNodeCG } from './nodecg';
import { openMainWindow } from './main-window';

let tray: Tray;

export function createTray() {
  tray = new Tray('static/tray-icon.png');
  tray.setToolTip('NodeCG GUI');
  setTrayMenu();
}

export function setTrayMenu() {
  if (tray === undefined) return;
  const menu = Menu.buildFromTemplate([
    { label: 'Start Server', click: () => {
        startNodeCG();
        setTrayMenu();
      }, enabled: !hasRunningNodeCG() },
    { label: 'Stop Server', click: () => {
        stopNodeCG();
        setTrayMenu();
      }, enabled: hasRunningNodeCG() },
    { type: 'separator' },
    { label: 'Control Window', click: openMainWindow },
    { label: 'NodeCG Window', click: openNodeCGWindow, enabled: hasRunningNodeCG() },
    {
      label: 'Open in Browser',
      click: () => shell.openExternal('http://localhost:9090'),
      enabled: hasRunningNodeCG()
    },
    { type: 'separator' },
    { role: 'quit' }
  ]);
  tray.setContextMenu(menu);
}