import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';

// https://developers.google.com/picker/docs/
// https://developers.google.com/picker/docs/reference#ViewId

// https://stackoverflow.com/questions/43617815/how-to-get-google-authentication-to-work-with-reactjs

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      auth2ApiLoaded: null,
      pickerApiLoaded: false,
      logedIn: this.props.logedIn
    };
  }

  pickerCallback(data) {
     let url = 'nothing';
     if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
       console.log('data uploaded!: ', data)
       let doc = data[google.picker.Response.DOCUMENTS][0];
       url = doc[google.picker.Document.URL];
     }
     // a modal here instead?
     let message = 'You picked: ' + url;
     document.getElementById('result').innerHTML = message;
   }

    uploadPhoto() {
      console.log('upload photo clicked')
      let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
      console.log('savedAuth: ', savedAuth)
      if (savedAuth.Zi.access_token) {
        let picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.PHOTO_UPLOAD).
        setOAuthToken(savedAuth.Zi.access_token).
        setDeveloperKey(config.UploadAPIKey).
        setCallback(this.pickerCallback).
        build();

        picker.setVisible(true);
      } else {
        console.error('No longer logged in')
        // redirect
      }
    }

    takePhoto() {
      let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
      if (savedAuth.Zi.access_token) {
        let picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.WEBCAM).
        setOAuthToken(savedAuth.Zi.access_token).
        setDeveloperKey(config.UploadAPIKey).
        setCallback(this.pickerCallback).
        build();

        picker.setVisible(true);
      } else {
        console.error('No longer logged in')
        // redirect
      }
    }

  render() {
    // TODO: Fix the way state is handled here. Loging in/out does not cause a rerender
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let logInOrOut = null;
    if (savedAuth != null) {
      logInOrOut = (
        <div>
          <button id="signout-button" onClick={this.uploadPhoto.bind(this)}>Upload Photo</button>
          <button id="signout-button" onClick={this.takePhoto.bind(this)}>Take Photo</button>
        </div>
      )
    } else {
      logInOrOut = (
        <div>
          You are not logged in. Login to upload or take photos
        </div>
      )
    }
    return (
      <div>
        <h1>Upload</h1>
        {logInOrOut}
      </div>
    );
  }
}
