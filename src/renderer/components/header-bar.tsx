import React from 'react';
import { Toolbar, Typography, AppBar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
  title: {
    flexGrow: 1
  }
});

export const HeaderBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.title}>
          NodeCG Manager
        </Typography>
        <Button component={RouterLink} to="/" color="inherit">Controls</Button>
        <Button component={RouterLink} to="/config" color="inherit">Config</Button>
      </Toolbar>
    </AppBar>
  );
};