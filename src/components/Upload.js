import React from 'react';

import Navigation from './Navigation';

export default class Upload extends React.Component {
  previewFile (event) {
    const file = event.target.files[0]
    const reader = new FileReader();

    reader.onloadend = () => {
      let targetElement = this.refs.imgPreview
      targetElement.src = reader.result
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  render() {
    return (
      <div>
        <h2>Upload your photos here</h2>
        <input type="file" onChange={this.previewFile.bind(this)}/>
        <img src="" ref="imgPreview"/>
      </div>
    );
  }
}
