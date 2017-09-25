import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';
import Webcam from 'react-webcam';
import $ from 'jquery'

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      logedIn: this.props.logedIn,
      capuredPhoto: null
    };
  }

    setRef (webcam) {
      console.log('setref')
      this.webcam = webcam;
    }

    takePhoto() {
      console.log('trying to take photo')
      let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
      if (savedAuth.Zi.access_token) {
        let picker = new google.picker.PickerBuilder().
        setUploadToAlbumId('123456').
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

    capture() {
      const imageSrc = this.webcam.getScreenshot();
      console.log('captured img with value of: ', Date.now())
      this.setState({
        capuredPhoto: imageSrc
      })
    };

    selectPhoto(e) {
      console.log('e.originalEvent.srcElement.files[i];: ', e.target.files[0])
      this.setState({
        capuredPhoto: e.target.files[0]
      })
    };

    uploadPhoto() {
      console.log('uploaded fileName: ', this.state.capuredPhoto.value)
      let data = new FormData(this)
      data.append('uploadImage', this.state.capuredPhoto)
      data.append('folder', 'bresee')
      const xhr = new XMLHttpRequest;
      xhr.open('POST', '/upload', true);
      $.ajax({
        type: 'POST',
        url:'/upload',
        data: data,
        processData: false,
        contentType: false,
        success: (data) => {
          console.log('pass with data: ', data)
        },
        fail: () => {
          console.log('fail')
        }
      })
    }

  render() {
    // TODO: Fix the way state is handled here. Loging in/out does not cause a rerender
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let logInOrOut = null;
    let photoPreview = null;
    let uploadPhotoButton = null;
    if (savedAuth != null) {
      logInOrOut = (
        <div>
          <Webcam
            audio={false}
            height={350}
            ref={this.setRef.bind(this)}
            screenshotFormat="image/jpeg"
            width={350}
          />
          <button onClick={this.capture.bind(this)}>Capture photo</button>
        </div>
      )
    } else {
      logInOrOut = (
        <div>
          You are not logged in. Login to upload or take photos
        </div>
      )
    }
    if (this.state.capuredPhoto !== null) {
      uploadPhotoButton = <button onClick={this.uploadPhoto.bind(this)}>Upload Photo</button>
      photoPreview = <img src={this.state.capuredPhoto} />
    }
    return (
      <div>
        <h1>Upload</h1>
        <input type="file" onChange={this.selectPhoto.bind(this)}/>
        {logInOrOut}
        {uploadPhotoButton}
        {photoPreview}
      </div>
    );
  }
}
