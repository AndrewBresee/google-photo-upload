import React from 'react';
import $ from "jquery";
import config from '../config';

// https://developers.google.com/apps-script/articles/picasa_google_apis

export default class Gallery extends React.Component {
  picasaCallback() {
    console.log('picasaCallback called')
  }
  getPhotos() {
    // change takazudo to the current user
    let t = this
    let $ul = $('ul');
    $.ajax({
        dataType: 'jsonp',
        url: 'https://picasaweb.google.com/data/feed/api/user/takazudo/albumid/5579032834644034737',
        data: {
            alt: 'json-in-script',
        },
        jsonpCallback: 'jsonpCallback',
        success: (data) => {
            console.log('data: ', data)
            var photos = [];
            $.each(data.feed.entry, function(){
                photos.push({
                    src: this.content.src
                });
            });
            console.log('GOT stuff!: ', photos)
        },
        error: function(){
            alert('failed ;(');
        }
    });
  }
  render() {
    return (
      <div>
        <h1>See your uploads</h1>
        <button onClick={this.getPhotos.bind(this)}></button>
      </div>
    );
  }
}
