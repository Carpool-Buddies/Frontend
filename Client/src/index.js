import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Home from './components/content/home/home';
import Register from './components/content/login/register';
import 'semantic-ui-css/semantic.min.css'



render(
  <HashRouter hashType="noslash">
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/register" component={Register} />

      </Switch>
    </App>
  </HashRouter>,
  document.getElementById('root')
);
