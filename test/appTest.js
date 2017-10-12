var should = require('should')
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

describe('Get S3 Folder', function() {
  it('Checks if S3 connection is working', function(done) {
    request(app).get('/getS3Folder?folder=testfolder')
      .expect(200, done)
    });
});
