import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';


export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    // might need to move oauthToken to parent scope
    this.state = {
      auth2ApiLoaded: null,
      pickerApiLoaded: false,
      logedIn: this.props.loggedIn
    };
  }

  render() {
    let savedAuth = JSON.parse(localStorage.getItem('GoogleAuth'));
    let logInOrOut = null;
    if (savedAuth === null) {
      logInOrOut = <button id="signin-button" onClick={this.props.handleSignInClick}>Sign In</button>
    } else {
      logInOrOut = <button id="signout-button" onClick={this.props.handleSignOutClick}>Sign Out</button>
    }

    return (
      <Navbar>
        <Nav>
          <NavItem eventKey={1}>
            <Link to="home">Home</Link>
          </NavItem>
          <NavItem eventKey={2}>
            <Link to="profile">Profile</Link>
          </NavItem>
          <NavItem eventKey={3}>
            <Link to="gallery">Gallery</Link>
          </NavItem>
          <NavItem eventKey={4}>
            <Link to="upload">Upload</Link>
          </NavItem>
          <div id="g-signin2" data-onsuccess={this.props.onSignIn} data-theme="dark" />
          <a href="#" onClick={this.props.signOut}>Sign out</a>
        </Nav>
      </Navbar>
    );
  }
}
