import React from 'react';

import Navigation from './Navigation';
import config from '../config';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      loggedIn: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.handleSignOutClick = this.handleSignOutClick.bind(this);
  }

  componentDidMount () {
    gapi.signin2.render("g-signin2", {
      'scope': "https://www.googleapis.com/auth/userinfo.email  https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/photos",
      'width': 200,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this. onSignIn
    });
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
  }

  handleSignOutClick(event) {
    localStorage.removeItem('GoogleAuth');
    this.setState({
      loggedIn: false
    });
  }

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    localStorage.setItem('GoogleAuth', JSON.stringify(googleUser));
    this.setState({
      loggedIn: true
    });
  }

  signOut() {
    localStorage.removeItem('GoogleAuth');
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    this.setState({
      loggedIn: false
    });
  }

  render() {
    const childWithProp = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {loggedIn: this.state.loggedIn});
    });
    return (
      <div>
        <h2>Google Photo Upload</h2>
        <Navigation
          onSignIn={this.onSignIn.bind(this)}
          signOut={this.signOut.bind(this)}
          loggedIn={this.state.loggedIn}/>
        {childWithProp}
      </div>
    );
  }
}
