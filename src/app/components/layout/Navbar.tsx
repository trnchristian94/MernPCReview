import React, { Component } from "react";

import { connect } from "react-redux";
import { logoutUser } from "userLogic/actions/authActions";
import { loginUser } from "userLogic/actions/authActions";

import { Link } from "react-router-dom";

import { Navbar, Nav, Form, Button } from "react-bootstrap";

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
  }

  onSubmit = (e: any) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  render() {
    console.log(window.location);
    const { user } = this.props.auth;
    return (
      <>
        <Navbar id="pc-principalNavbar">
          <Nav>
            <Link to={"/"} className="nav-link">
              <Navbar.Brand id="pc-principalBrand">The PC Review</Navbar.Brand>
            </Link>
          </Nav>
        </Navbar>
        <Navbar variant="dark">
          <Nav className="mr-auto">
            <Link to={"/"} className="nav-link">
              Home
            </Link>
            <Link to={"/tasks"} className="nav-link">
              Tasks
            </Link>
            {!this.props.auth.isAuthenticated ? (
              <>
                <Link to={"/register"} className="nav-link">
                  Register
                </Link>
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </>
            ) : (
              <Link to={"/userList"} className="nav-link">
                Users
              </Link>
            )}
          </Nav>
          {this.props.auth.isAuthenticated ? (
            <div>
              <span className="mr-2">Welcome {user.name.split(" ")[0]}!</span>
              <Button variant="dark" size="sm" onClick={this.onLogoutClick}>
                Logout
              </Button>
            </div>
          ) : (
            <Form inline onSubmit={this.onSubmit}>
              <Form.Row>
                <Form.Group className="mr-2">
                  <Form.Label className="mr-2">Email</Form.Label>
                  <Form.Control
                    size="sm"
                    type="email"
                    placeholder="Enter email"
                    onChange={this.onChange}
                    value={this.state.email}
                    id="email"
                  />
                </Form.Group>

                <Form.Group className="mr-2">
                  <Form.Label className="mr-2">Password</Form.Label>
                  <Form.Control
                    size="sm"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChange}
                    value={this.state.password}
                    id="password"
                  />
                </Form.Group>
                <Button variant="dark" type="submit" size="sm">
                  Login
                </Button>
              </Form.Row>
            </Form>
          )}
        </Navbar>
      </>
    );
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { logoutUser, loginUser })(Header);
