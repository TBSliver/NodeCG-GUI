
// Commands to actually do things
export class ipcCommands {
  static startNodeCG = 'run-start-nodecg';
  static stopNodeCG = 'run-stop-nodecg';
  static restartNodeCG = 'run-restart-nodecg';
  static openNodeCGWindow = 'run-open-nodecg-window';
  static openNodeCGBrowser = 'run-open-nodecg-browser';
  static openNodeCGFolder = 'run-open-nodecg-folder';
  static getExternalUrl = 'get-external-nodecg-url';
  static getConfig = 'get-config';
  static setConfig = 'set-config';
}

// Status retrieval
export class ipcStatus {
  static nodeCGRunning = 'status-nodecg-running';
}

// Messages for Status
export class ipcMessages {
  static nodeCGRunning = 'message-nodecg-running';
  static configUpdated = 'message-config-updated';
}