import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import fs from 'fs';
import S3FS from 's3fs';
import configFile from '../src/config'
let s3fsImpl = new S3FS('reactphotouploader', {
  accessKeyId: configFile.AWSAccessKeyID,
  secretAccessKey: configFile.AWSSecretKey
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

app.post('/testUpload', (req, res) => {
  let file = req.files.image;
  let folderName = req.body.folder
  let stream = fs.createReadStream(file.path);
  return s3fsImpl.writeFile(folderName + "\\" + file.originalFilename, stream).then(() => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Upload worked!')
      }
    })
    res.redirect('/gallery')
  })
})

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
