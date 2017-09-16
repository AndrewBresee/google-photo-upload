import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';

// https://developers.google.com/api-client-library/javascript/start/start-js
// https://developers.google.com/api-client-library/javascript/samples/samples#authorizing-and-making-authorized-requests

// https://developers.google.com/picker/docs/

// QUESTION
// IS the token saved on the window now?
// Setting visability of signin/signout on token
// Checking for auth2

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      auth2: null,
      pickerApiLoaded: false,
      oauthToken: null
    };
  }
  componentDidMount () {
    window.gapi.load('auth2', () => {
      console.log('auth2 loaded')
    })
    window.gapi.load('picker', {'callback': this.onPickerApiLoad});
  }

  onPickerApiLoad() {
    console.log('onPickerApiLoad loaded')
    this.pickerApiLoaded = true;
    this.createPicker();
  }

    handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        this.oauthToken = authResult.access_token;
        this.createPicker();
      }
    }

    createPicker() {
      console.log('createPicker clicked')
      if (this.pickerApiLoaded && this.oauthToken) {
        let picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.PHOTOS).
        setOAuthToken(this.oauthToken).
        setDeveloperKey(developerKey).
        setCallback(pickerCallback).
        build();

    // set this visability later
    picker.setVisible(true);
    }
  }
    handleSignInClick(event) {
      // might need to authorize with a developer key later...
      window.gapi.auth2.authorize(
          {
            'client_id': config.ClientID,
            'scope': ['https://www.googleapis.com/auth/photos'],
            'immediate': false
          },
          this.handleAuthResult);
    }

    handleSignOutClick(event) {
      window.gapi.auth2.getAuthInstance().signOut();
    }

  render() {
    return (
      <div>
        <h1>Login Page</h1>
          <button id="signin-button" onClick={this.handleSignInClick.bind(this)}>Sign In</button>
          <button id="signout-button" onClick={this.handleSignOutClick}>Sign Out</button>
          <button id="signout-button" onClick={this.makeApiCall}>makeApiCall</button>
      </div>
    );
  }
}
