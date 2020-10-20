import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ipcRenderer } from 'electron';

const useStyles = makeStyles(theme => ({
  toolbarOffset: theme.mixins.toolbar,
}))

const App = () => {
  const classes = useStyles();

  const handleStart = () => console.log(ipcRenderer.sendSync('start-button'));
  const handleStop = () => console.log(ipcRenderer.sendSync('stop-button'));

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            NodeCG Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarOffset}/>
      <Button onClick={handleStart} color="primary" variant="contained">Start</Button>
      <Button onClick={handleStop} color="primary" variant="contained">Stop</Button>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));