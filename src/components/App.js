import React from 'react';

import Navigation from './Navigation';
import config from '../config';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      logedIn: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.handleSignOutClick = this.handleSignOutClick.bind(this);
  }

  componentDidMount () {
    console.log('componentDidMount')
    gapi.signin2.render("g-signin2", {
      'scope': "https://www.googleapis.com/auth/userinfo.email  https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/photos",
      'width': 200,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this. onSignIn
    });
    gapi.load('auth2', function() {
      console.log('auth2 loaded')
      gapi.auth2.init();
    });
    gapi.load('picker', () => {
      console.log('picker loaded')
      this.pickerApiLoaded = true;
    })
  }

  handleSignOutClick(event) {
    // TODO: Fix logout flow. Might need to usegapi.auth2.getAuthInstance().disconnect();
    localStorage.removeItem('GoogleAuth');
    this.setState({
      logedIn: false
    });
  }

  onSignIn(googleUser) {
    console.log('onSignIn this is: ', this)
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    localStorage.setItem('GoogleAuth', JSON.stringify(googleUser));
    this.setState({
      logedIn: false
    });
  }

  signOut() {
    localStorage.removeItem('GoogleAuth');
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  render() {
    const childWithProp = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {logedIn: this.state.logedIn});
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
