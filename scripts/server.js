import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import fs from 'fs';
import configFile from '../src/config';
import AWS from 'aws-sdk';

AWS.config.update({
    "accessKeyId": configFile.AWSAccessKeyID,
    "secretAccessKey": configFile.AWSSecretKey
});



const params = {Bucket: 'reactphotouploader', Key: 'bresee/' };
let s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: params
});

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

app.post('/upload', (req, res) => {
  let fileDetail = req.files;
  let stream
  let fileName
  if (fileDetail.uploadImage !== undefined) {
    fileDetail = fileDetail.uploadImage
    stream = fs.createReadStream(fileDetail.path)
    fileName = encodeURIComponent(fileDetail.name)
  } else {
    fileDetail = req.body.uploadImage
    console.log('fileDetail: ', fileDetail)
    stream = new Buffer(fileDetail, 'base64');
    fileName = encodeURI(fileDetail.slice(0,10))
    // let writeStream = fs.writeFileSync(file, bitmap);
  }

  const folderName = req.body.folder
  const albumPhotosKey = folderName + '/';

  let photoKey = albumPhotosKey + fileName
  s3.upload({
    Key: photoKey,
    Bucket: 'reactphotouploader',
    Body: stream,
    ACL: 'public-read'
  }, function(err, data) {
    if (err) {
      console.log('There was an error uploading your photo: ', err.message);
      res.status(400).send();
    } else {
      res.status(200).send(data);
    }
  });
});

app.get('/getS3Folder', (req, res) => {
  console.log('server hit')
  const albumName = req.query.folder + "/"
  return s3.listObjects({Prefix: albumName}, (err, data) => {
    console.log('data on the server: ', data)
    let getHtml = (template) => {
      return template.join('\n');
    }
    if (err) {
      console.log(err, err.stack)
    } else {
      const bucketUrl = "http://reactphotouploader.s3.amazonaws.com/"
      // We skip the first element because it is the directory
      // that the pictures exist in
      let photos = data.Contents.slice(1).map((photo, i) => {
        const photoKey = photo.Key;
        const photoUrl = bucketUrl + photoKey
        return photoUrl
      });
      console.log('about to send data: ', photos)
      res.status(200).send(photos);
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
