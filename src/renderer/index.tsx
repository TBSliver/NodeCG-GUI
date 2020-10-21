import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ipcRenderer, shell } from 'electron';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  toolbarOffset: {
    ...theme.mixins.toolbar
  }
}));

const App = () => {
  const classes = useStyles();
  const [isStarted, setIsStarted] = useState(ipcRenderer.sendSync('get-start-status'));

  ipcRenderer.on('start-status', (e, args) => setIsStarted(args));

  const handleStart = () => ipcRenderer.send('start-button');
  const handleStop = () => ipcRenderer.send('stop-button');
  const handleOpen = () => ipcRenderer.send('open-nodecg');
  const handleOpenBrowser = () => shell.openExternal('http://localhost:9090');

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            NodeCG Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarOffset} />
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
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));