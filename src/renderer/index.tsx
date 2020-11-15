import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, HashRouter, Route } from 'react-router-dom';
import { HeaderBar } from './components/header-bar';
import { Controls } from './pages/controls';
import { Config } from './pages/config';
import { Container, Toolbar } from '@material-ui/core';

const App = () => {

  return (
    <>
      <HeaderBar />
      <Toolbar />
      <Container>
        <Switch>
          <Route path="/config">
            <Config />
          </Route>
          <Route path="/">
            <Controls />
          </Route>
        </Switch>
      </Container>
    </>
  );
};

ReactDOM.render(<HashRouter><App /></HashRouter>, document.querySelector('#app'));