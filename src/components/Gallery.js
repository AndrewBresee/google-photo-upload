import React from 'react';
import $ from 'jquery'

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      photos: []
    };
  }

  getPhotos() {
    const t = this;
    $.ajax({
      type: "GET",
      url: "/getS3Folder?folder=bresee",
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
    console.log('this.state: ', this.state)
    let photos = this.state.photos.map((item, i) => {
      return (
        <span key={i}>
          <img style={{width:"128px", height:"128px"}} src={item}/>
        </span>
      )
    })
    return (
      <div>
        <h1>See your uploads</h1>
        <button onClick={this.getPhotos.bind(this)}>Get photos</button>
        <div>
          {photos}
        </div>
      </div>
    );
  }
}
