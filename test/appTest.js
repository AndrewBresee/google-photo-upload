var request = require('supertest')
let chai = require('chai');
var app = require('../scripts/server');

describe('badRouteTest', function() {
  this.timeout(15000)
  it('BadRouteTest responds with status 400', function(done) {
    request(app).get('/badRouteTest')
      .expect(400, done);
    });
});

describe('Get S3 Folder', function() {
  this.timeout(15000);
  it('Checks if S3 connection is working', function(done) {
    request(app).get('/getS3Folder?folder=andrewbreseesmartthings')
      .expect(200, done);
    });
});


describe('Post to S3 Folder', function() {
    this.timeout(15000);
    it('Checks upload to S3 is working', function(done) {
       request(app).post('/upload')
        .attach('file', './testUpload.png')
        .expect(200, done);
    });
});
