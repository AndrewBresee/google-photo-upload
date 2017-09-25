import React from 'react';
import $ from 'jquery'

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      photos: [],
      logedIn: this.props.logedIn
    };
  }

  getPhotos() {
    const savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let folderName = savedAuth.w3.U3
    folderName = folderName.replace(".","")
    folderName = folderName.replace("@","")
    folderName = folderName.replace(".com","")
    const t = this;
    $.ajax({
      type: "GET",
      url: "/getS3Folder?folder=" + folderName,
      contentType: "text/xml",
      cache: true,
      dataType: "json",
      jsonpCallback: 'callback',
      success: (data) => {
        t.setState({
          photos: data
        })
      },
      fail: () => {
        console.log('fail')
      }
    });
  }

  render() {
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let seePhotosButtonAndButton
    let photos = this.state.photos.map((item, i) => {
      return (
        <span key={i}>
          <img style={{width:"128px", height:"128px", padding: "1%"}} src={item}/>
        </span>
      )
    })
    if (savedAuth !== null) {
      seePhotosButtonAndButton = (
        <div>
          <button onClick={this.getPhotos.bind(this)}>Get photos</button>
          {photos}
        </div>
      )
    } else {
      seePhotosButtonAndButton = <span>Must log in to see photos</span>
    }
    return (
      <div>
        <h1>See your uploads</h1>
        {seePhotosButtonAndButton}
      </div>
    );
  }
}
