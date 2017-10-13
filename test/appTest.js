import * as React from 'React'

var should = require('should');
var request = require('supertest');
var chai =  require('chai');
var expect =  require('expect');
var app = require('../scripts/server');
var ReactTestUtils = require('react-dom/test-utils');
import App from '../src/components/App';


describe('badRouteTest', function() {
  this.timeout(15000)
  it('BadRouteTest responds with status 400', function(done) {
    request(app).get('/badRouteTest')
      .expect(400, done);
    });
});

describe('Get S3 Folder', function() {
  it('Checks if S3 connection is working', function(done) {
    request(app).get('/getS3Folder?folder=testfolder')
      .expect(200, done)
    });
});


describe('Post to S3 Folder', function() {
    this.timeout(15000);
    it('Checks upload to S3 is working', function(done) {
       request(app).post('/upload')
        .field('folder', 'testfolder')
        .attach('uploadImage', __dirname + '/testUpload.png')
        .expect(200)
        .end(function(err, res1) {
          res1.body.should.have.property('ETag')
          done();
        })
    });
});

describe('coponents/App', () => {
  it('Should render', () => {
    const renderedItem = ReactTestUtils.renderIntoDocument(<App />)
    expect(renderedItem).toExist();
  })
})
