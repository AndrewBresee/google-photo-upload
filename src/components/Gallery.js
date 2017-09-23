import React from 'react';
import $ from 'jquery'

export default class Gallery extends React.Component {
  getPicasa() {
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let access_token = savedAuth.Zi.access_token
    let userId = "109317027548384374583"
    console.log('savedAuth: ', savedAuth)
    $.ajax({ //gives 204 no content response
            dataType: "jsonp",
            url: "https://picasaweb.google.com/data/feed/base/user/" + userId,
            data: {
                alt: 'json-in-script',
            },
            jsonpCallback: 'jsonpCallback',
            beforeSend: function(xhr){ //headers
                xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
                xhr.setRequestHeader('GData-Version', '2');
            },
            success: function(data){
              console.log('data: ', data)
              var photos = [];
              $.each(data.feed.entry, function(item){
                  // TODO: Get the id of the albumb here and use that for uploading later
                  console.log('item: ', item)
                  photos.push({
                      src: this.content.src
                  });
              });
              console.log('GOT stuff!: ', photos)
            },
            fail: function(){
                console.log("fail");
            }
        })
        .done(function(data){
            console.log(data);
        });
  }
  createAlbum() {
    var request = '<?xml version="1.0" encoding="UTF-8"?>' +
           '<entry xmlns="http://www.w3.org/2005/Atom"'> +
           '     <title type="text">Trip To Italy</title>'+
           '</entry>';

   var request2 = '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:gphoto="http://schemas.google.com/photos/2007"><title type="text">Trip To Italy</title><summary type="text">This was the recent trip I took to Italy.</summary><gphoto:location>Italy</gphoto:location><gphoto:access>public</gphoto:access><gphoto:timestamp>1152255600000</gphoto:timestamp><media:group><media:keywords>italy, vacation</media:keywords></media:group><category  scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/photos/2007#album"></category></entry>'

    console.log('request2: ', request2)

    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let access_token = savedAuth.Zi.access_token
    let userId = "109317027548384374583"
    $.ajax({
      type: "POST",
      contentType: "text/xml",
      dataType: "jsonp",
      url: 'https://picasaweb.google.com/data/feed/api/user/' + userId,
      data: request2,
      beforeSend: function(xhr){ //headers
          xhr.setRequestHeader("Content-Type: application/xml");
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('GData-Version', '2');
      },
      processData: false,
      success: function(data) {
        console.log('success?')
        let response = data;
        let parsedData = $.parseXML(response);
        console.log('POST success!: ', data)
        console.log('parsedData: ', parsedData)
      },
      fail: function(){
          console.log("fail");
      }
    });
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
        <button onClick={this.getPicasa}>Get picasa</button>
        <button onClick={this.createAlbum}>Create albumb</button>
      </div>
    );
  }
}
