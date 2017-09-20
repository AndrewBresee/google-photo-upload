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
      </div>
    );
  }
}
