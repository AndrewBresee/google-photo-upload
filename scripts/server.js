import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import fs from 'fs';
import configFile from '../src/config'

//


import AWS from 'aws-sdk'
let s3 = new AWS.S3();
let params = {Bucket: 'reactphotouploader', Key: 'bresee/' }

import multiparty from 'connect-multiparty';

// file handling middleware
let multipartyMiddleware = multiparty();

/* eslint-disable no-console */
const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(multipartyMiddleware);
app.use(require('webpack-hot-middleware')(compiler));

app.post('/testUpload', (req, res) => {
  let file = req.files.image;
  let folderName = req.body.folder
  let fileName = file.name;
  let albumPhotosKey = encodeURIComponent(folderName) + '//';

  let photoKey = albumPhotosKey + fileName;
  s3.upload({
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      console.log('There was an error uploading your photo: ', err.message);
    }
    console.log('Successfully uploaded photo.');
  });
});

app.get('/getS3Folder', (req, res) => {
  let albumName = req.query.folder + "/"
  s3.listObjects({Bucket: 'reactphotouploader', Prefix: albumName}, (err, data) => {
    let t = this
    let getHtml = (template) => {
      return template.join('\n');
    }
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log('data: ', data)
      let bucketUrl = "http://bucket.s3.amazonaws.com/reactphotouploader/"
      let photos = data.Contents.map((photo) => {
        let photoKey = photo.Key;
        let photoUrl = bucketUrl + photoKey
        return photoUrl
      });
      res.send(photos);
      res.end('It worked!')
    }
  })
});

app.get('/*', (req, res) => {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('The server is started')
    open(`http://localhost:${port}`);
  }
});
