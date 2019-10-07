import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './pages/App';
import Splash from './pages/Splash';

import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';

import { ContextProvider } from './context';

import ProtectedRoute from './components/common/ProtectedRoute';

const Root = () => (
  <ContextProvider>
    <Router>
      <Switch>
        <ProtectedRoute exact path='/' component={App} />
        <Route path='/login' component={Splash} />
      </Switch>
    </Router>
  </ContextProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
