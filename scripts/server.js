import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import fs from 'fs';
import configFile from '../src/config'

// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html#s3-example-photo-album-create-album


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
  return s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log(data);
    }
  });
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
