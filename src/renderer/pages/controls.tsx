import { Button, Grid, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { ipcCommands, ipcMessages, ipcStatus } from 'common/ipc-messages';

export const Controls = () => {
  const [isStarted, setIsStarted] = useState(ipcRenderer.sendSync(ipcStatus.nodeCGRunning));
  const [browserUrl, setBrowserUrl] = useState(ipcRenderer.sendSync(ipcCommands.getExternalUrl));

  ipcRenderer.on(ipcMessages.nodeCGRunning, (e, args) => setIsStarted(args));
  ipcRenderer.on(ipcMessages.configUpdated, () => setBrowserUrl(ipcRenderer.sendSync(ipcCommands.getExternalUrl)));

  const handleStart = () => ipcRenderer.send(ipcCommands.startNodeCG);
  const handleStop = () => ipcRenderer.send(ipcCommands.stopNodeCG);
  const handleOpen = () => ipcRenderer.send(ipcCommands.openNodeCGWindow);
  const handleOpenBrowser = () => ipcRenderer.send(ipcCommands.openNodeCGBrowser);
  const handleOpenFolder = () => ipcRenderer.send(ipcCommands.openNodeCGFolder);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3" component="h1">Controls</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleStart} color="primary" variant="contained" fullWidth
                disabled={isStarted}>Start</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleStop} color="secondary" variant="contained" fullWidth
                disabled={!isStarted}>Stop</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleOpen} color="default" variant="contained" fullWidth disabled={!isStarted}>Open</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleOpenBrowser} color="default" variant="contained" fullWidth disabled={!isStarted}>
          Open in Browser</Button>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleOpenFolder} color="default" variant="contained" fullWidth>
          Open Folder</Button>
      </Grid>
      <Grid item xs={12}>
        <Typography>Or open {browserUrl}</Typography>
      </Grid>
    </Grid>
  );
};