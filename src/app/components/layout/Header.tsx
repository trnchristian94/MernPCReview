import React, { Component } from "react";

import { connect } from "react-redux";
import { logoutUser } from "userLogic/actions/authActions";

type MyProps = {
  auth: any;
  logoutUser?: any;
};
type MyState = {};
class Header extends Component<MyProps, MyState> {
  onLogoutClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    return (
      <nav className="light-blue darken-4">
        <div className="container">
          <a className="brand-logo" href="/">
            The PC Review
          </a>
          <div className="right">
            {this.props.auth.isAuthenticated ? (
              <div>
                <span>Welcome {user.name.split(" ")[0]}!</span>
                <button className="btn" onClick={this.onLogoutClick}>
                  Logout
                </button>
              </div>
            ) : (
              <span>You are not logged in</span>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Header);
