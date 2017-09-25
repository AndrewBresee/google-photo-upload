# Bresee's S3 Photo Upload

## Purpose
The purpose of this project is to demonstrate photo uploading and GETs to and from an Amazon S3 Bucket. I used Google Login for a certain level of authentication and consistency in client experience. Different clients will see their own Galleries as the Bucket Object is set based on the client's login information.

## Getting started
To get started, add a config.js as below:
```
export default {
  'AWSAccessKeyID': <yourKeyID>,
  'AWSSecretKey': <yourSecretKey>
};
```

If you are starting with a new S3 Bucket, you will also have to provision the Bucket Policy to be public.

```
{
    "Version": "2008-10-17",
    "Id": "Policy1380877762691",
    "Statement": [
        {
            "Sid": "Stmt1380877761162",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucketName>/*"
        }
    ]
}
```
Finally, in the server.js file, change `const bucketUrl = "http://reactphotouploader.s3.amazonaws.com/"` to be the url to the Bucket you just created. Usually it will be `http://<yourbucket>.s3.amazonaws.com/`, but this can change depending on several variables.

Once these variables are set, run `npm install` in the terminal, then `npm start` to start the development server.

## Next steps
1. Add Webcam uploader
..* Earlier in the project, I attempted to add a webcam to upload taken photos to S3. This was not successful as every implementation of a webcam I tried upload photos as base64. This was an issue for POSTing to S3. There probably is a simple solution to this.
2. Add photo editing before POST
..* After webcam uploader is working, I would like to add photo editing, such as cropping, before uploading.
3. Add better authentication
..* Currently authentication is set based on session storage. Similarly, the Bucket Object, corresponding to the client's own object, is set from this stored session. This is insecure. A malicious user could fake this session object and get access to other users photos.

## Known bugs
* When restaring the server, a new web browser window is open. It appears that when there are multiple tabs open to the development server, requests and responses are not made. If you experience this, simply close all windows, restart the server, and do a clean refresh in the browser window.
