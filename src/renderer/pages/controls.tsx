import { Button, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { ipcRenderer, shell } from 'electron';

export const Controls = () => {
  const [isStarted, setIsStarted] = useState(ipcRenderer.sendSync('get-start-status'));

  ipcRenderer.on('start-status', (e, args) => setIsStarted(args));

  const handleStart = () => ipcRenderer.send('start-button');
  const handleStop = () => ipcRenderer.send('stop-button');
  const handleOpen = () => ipcRenderer.send('open-nodecg');
  const handleOpenBrowser = () => shell.openExternal('http://localhost:9090');

  return (
    <Grid container spacing={3}>
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
  </Grid>
  );
}