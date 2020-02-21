import React, { Component } from "react";

import { connect } from "react-redux";
import { logoutUser } from "userLogic/actions/authActions";
import { loginUser } from "userLogic/actions/authActions";

type MyProps = {
  auth: any;
  loginUser: any;
  logoutUser: any;
  errors: any;
};
type MyState = {
  email: string;
  password: string;
  [x: number]: any;
};
class Header extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  onLogoutClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  onChange = (e: any) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.auth.isAuthenticated) {
      window.location.href = "./dashboard";
    }
    if (nextProps.errors) {
      window.location.href = "./login";
    }
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    console.log(userData);
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
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
              <form
                noValidate
                onSubmit={this.onSubmit}
                style={{ display: "inline-flex" }}
              >
                <div className="input-field col">
                  <input
                    onChange={this.onChange}
                    value={this.state.email}
                    id="email"
                    type="email"
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div
                  className="input-field col"
                  style={{ marginLeft: "11.250px" }}
                >
                  <input
                    onChange={this.onChange}
                    value={this.state.password}
                    id="password"
                    type="password"
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="col" style={{ paddingLeft: "11.250px" }}>
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { logoutUser, loginUser })(Header);
