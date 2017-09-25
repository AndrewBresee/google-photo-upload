import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';
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
      imagePreviewUrl: null,
      uploadMessage: null
    };
  }

  selectPhoto(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = (e) => {
      console.log('res')
      this.setState({
        capuredPhoto: file,
        imagePreviewUrl: reader.result,
        uploadMessage: null
      });
    }
    reader.readAsDataURL(file)
  };

  uploadPhoto() {
    const t = this
    const savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let folderName = savedAuth.w3.U3
    folderName = folderName.replace(".","")
    folderName = folderName.replace("@","")
    folderName = folderName.replace(".com","")
    let data = new FormData(this)
    data.append('uploadImage', this.state.capuredPhoto)
    data.append('folder', folderName)
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
        t.setState({
          imagePreviewUrl: null,
          uploadMessage: "Upload Complete!"
        })
      },
      fail: () => {
        console.log('fail')
      }
    })
  }

  render() {
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let logInOrOut = null;
    let photoPreview = null;
    let uploadPhotoButton = null;
    if (this.props.logedIn === true) {
      logInOrOut = (
        <div>
          <input type="file" onChange={this.selectPhoto.bind(this)}/>
        </div>
      )
    } else {
      logInOrOut = (
        <div>
          You are not logged in. Login to upload photos
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
        {logInOrOut}
        {uploadPhotoButton}
        {photoPreview}
        {this.state.uploadMessage}
      </div>
    );
  }
}
