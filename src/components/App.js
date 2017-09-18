import React from 'react';

import Navigation from './Navigation';
import config from '../config';

export default class App extends React.Component {

  constructor(props) {
    super();
    // might need to move oauthToken to parent scope
    this.state = {
      logedIn: false
    };
  }

  componentDidMount () {
    gapi.load('auth2', () => {
      console.log('auth2 loaded')
      this.auth2ApiLoaded = true;
    })
    gapi.load('picker', () => {
      console.log('picker loaded')
      this.pickerApiLoaded = true;
    })
  }

  handleAuthResult(authResult) {
    console.log('handleAuthResult: ', authResult)
    if (authResult && !authResult.error) {
      localStorage.setItem('GoogleAuth', JSON.stringify(authResult));
      this.setState({
        logedIn: true
      })
    }
  }

  handleSignInClick(event) {
    console.log('clicked login on the app')
    let t = this
    window.gapi.auth2.authorize(
        {
          'client_id': config.ClientID,
          'scope': ['https://www.googleapis.com/auth/photos'],
          'immediate': false
        },
        this.handleAuthResult.bind(t));
  }

  handleSignOutClick(event) {
    // TODO: Fix logout flow. Might need to usegapi.auth2.getAuthInstance().disconnect();
    localStorage.removeItem('GoogleAuth');
    this.setState({
      logedIn: false
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
          handleSignOutClick={this.handleSignOutClick.bind(this)}
          handleSignInClick={this.handleSignInClick.bind(this)}
          loggedIn={this.state.loggedIn}/>
        {childWithProp}
      </div>
    );
  }
}
