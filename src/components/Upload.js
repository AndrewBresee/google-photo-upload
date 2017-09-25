import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';
import Webcam from 'react-webcam';
import $ from 'jquery'

// might have to create bucket when they Login
// http://www.joshsgman.com/upload-to-and-get-images-from-amazon-s3-with-node-js/

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      logedIn: this.props.logedIn,
      capuredPhoto: null,
      imagePreviewUrl: null
    };
  }

    setRef (webcam) {
      console.log('setref')
      this.webcam = webcam;
    }

    capture() {
      const imageSrc = this.webcam.getScreenshot();
      console.log('captured img with value of: ', Date.now())
      this.setState({
        capuredPhoto: imageSrc
      })
    };

    selectPhoto(e) {
      e.preventDefault();
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onload = (e) => {
        this.setState({
          capuredPhoto: file,
          imagePreviewUrl: reader.result
        });
      }

      reader.readAsDataURL(file)
    };

    uploadPhoto() {
      console.log('uploaded fileName: ', this.state.capuredPhoto)
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

    test() {
      console.log('')
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
            screenshotFormat="file"
            width={350}
            onUserMedia={this.test.bind(this)}
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
    if (this.state.imagePreviewUrl !== null ) {
      uploadPhotoButton = <button onClick={this.uploadPhoto.bind(this)}>Upload Photo</button>
      photoPreview = <img src={this.state.imagePreviewUrl} />
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
