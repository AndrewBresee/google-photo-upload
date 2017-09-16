import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, browserHistory, Redirect, IndexRoute } from 'react-router';

import App from './App';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Gallery from './Gallery';
import Upload from './Upload';

// https://www.youtube.com/watch?v=1w-oQ-i1XB8&t=145s
// https://stackoverflow.com/questions/34977898/need-oauth-2-client-implementation-for-react-router
// https://medium.com/the-many/adding-login-and-authentication-sections-to-your-react-or-react-native-app-7767fd251bd1


const Root = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Login}/>
      <Route path="/home" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/upload" component={Upload} />
      <Route path="/gallery" component={Gallery} />
    </Route>
    <Redirect from="/*" to="/home" />
  </Router>
);

export default Root;
