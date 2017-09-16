import React from 'react';
import GoogleLogin from 'react-google-login';
import config from '../config';

export default class Login extends React.Component {
  successGoogle(event) {
    const storage = window.sessionStorage;
    storage.setItem('tokenObj', JSON.stringify(event.tokenObj));
    storage.setItem('profileObj', JSON.stringify(event.profileObj));
  }
  failureGoogle(event) {
    console.log('failure because of: ', event)
  }
  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <GoogleLogin
          clientId={config.GoogleAPIKey}
          buttonText="Login"
          onSuccess={this.successGoogle}
          onFailure={this.failureGoogle}
        />
      </div>
    );
  }
}
