import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, HashRouter, Route } from 'react-router-dom';
import { HeaderBar } from './components/header-bar';
import { Controls } from './pages/controls';
import { Config } from './pages/config';

const useStyles = makeStyles(theme => ({
  toolbarOffset: {
    ...theme.mixins.toolbar
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <>
      <HeaderBar />
      <div className={classes.toolbarOffset} />
      <Switch>
        <Route path="/config">
          <Config />
        </Route>
        <Route path="/">
          <Controls />
        </Route>
      </Switch>
    </>
  );
};

ReactDOM.render(<HashRouter><App /></HashRouter>, document.querySelector('#app'));