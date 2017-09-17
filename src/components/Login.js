import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';

// https://developers.google.com/picker/docs/
// https://developers.google.com/picker/docs/reference#ViewId

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      auth2ApiLoaded: null,
      pickerApiLoaded: false,
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

  pickerCallback(data) {
     let url = 'nothing';
     if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
       let doc = data[google.picker.Response.DOCUMENTS][0];
       url = doc[google.picker.Document.URL];
     }
     // a modal here instead?
     let message = 'You picked: ' + url;
     document.getElementById('result').innerHTML = message;
   }

    handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        localStorage.setItem('GoogleAuth', JSON.stringify(authResult));
        this.setState({
          logedIn: true
        })
      }
    }

    uploadPhoto() {
      let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
      if (this.pickerApiLoaded && savedAuth.access_token) {
        let picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.PHOTO_UPLOAD).
        setOAuthToken(savedAuth.access_token).
        setDeveloperKey(config.UploadAPIKey).
        setCallback(this.pickerCallback).
        build();

        picker.setVisible(true);
      }
    }

    takePhoto() {
      let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
      if (this.pickerApiLoaded && savedAuth.access_token) {
        let picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.WEBCAM).
        setOAuthToken(savedAuth.access_token).
        setDeveloperKey(config.UploadAPIKey).
        setCallback(this.pickerCallback).
        build();

        picker.setVisible(true);
      }
    }

    handleSignInClick(event) {
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
      localStorage.removeItem('GoogleAuth');
      let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
      this.setState({
        logedIn: false
      })
    }

  render() {
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let logInOrOut = null;
    if (savedAuth === null) {
      logInOrOut = <button id="signin-button" onClick={this.handleSignInClick.bind(this)}>Sign In</button>
    } else {
      logInOrOut = <button id="signout-button" onClick={this.handleSignOutClick.bind(this)}>Sign Out</button>
    }
    return (
      <div>
        <h1>Login Page</h1>
          <div id="result"></div>
          {logInOrOut}
          <button id="signout-button" onClick={this.uploadPhoto.bind(this)}>Upload Photo</button>
          <button id="signout-button" onClick={this.takePhoto.bind(this)}>Take Photo</button>
      </div>
    );
  }
}
