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
      loggedIn: this.props.loggedIn,
      capuredPhoto: null,
      imagePreviewUrl: null,
      uploadMessage: null,
      wrongFileType: false
    };
  }

  selectPhoto(e) {
    e.preventDefault();
    let reader = new FileReader();
    const acceptableFileTypes = ['jpg','gif','bmp','png']
    const file = e.target.files[0];
    const fileName = e.target.files[0].name;
    const fileNameParts = fileName.split('.')
    const fileNameEnd = fileNameParts[fileNameParts.length -1].toLowerCase();
    if (acceptableFileTypes.indexOf(fileNameEnd) === -1) {
      this.setState({
        wrongFileType: true
      });
    } else {
      reader.onload = (e) => {
        this.setState({
          wrongFileType: false,
          capuredPhoto: file,
          imagePreviewUrl: reader.result,
          uploadMessage: null
        });
      }
      reader.readAsDataURL(file)
    }
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
        t.setState({
          imagePreviewUrl: null,
          uploadMessage: "Upload Complete!"
        })
      },
      fail: () => {
        // TODO: handle upload error
        console.log('fail')
      }
    })
  }

  render() {
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let logInOrOut = null;
    let photoPreview = null;
    let uploadPhotoButton = null;
    let wrongFileType = null;
    if (this.props.loggedIn === true) {
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
      photoPreview = <img src={this.state.imagePreviewUrl} style={{width:"25%", height:"auto"}} />
    }

    if (this.state.wrongFileType) {
      wrongFileType = <div>Wrong File Type!</div>
    } else {
      wrongFileType = null
    }

    return (
      <div>
        <h1>Upload</h1>
        {logInOrOut}
        {uploadPhotoButton}
        {photoPreview}
        {wrongFileType}
        {this.state.uploadMessage}
      </div>
    );
  }
}
