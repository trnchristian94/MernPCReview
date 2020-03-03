import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { logoutUser } from "userLogic/actions/authActions";
import { loginUser } from "userLogic/actions/authActions";

import { useToasts } from "react-toast-notifications";

import { Link, Redirect } from "react-router-dom";

import { Navbar, Nav, Form, Button } from "react-bootstrap";

interface Props {
  auth: any;
  loginUser: any;
  logoutUser: any;
  errors: any;
}

function Header({ auth, loginUser, logoutUser, errors }: Props) {
  const { addToast } = useToasts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setConnected(true);
      addToast("You logged in succesfully", {
        appearance: "success",
        autoDismiss: true
      });
    }
  }, [auth.isAuthenticated]);

  const onLogoutClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    logoutUser();
    setConnected(false);
    addToast("User logged out", {
      appearance: "success",
      autoDismiss: true
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password
    };
    loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  const { user } = auth;

  return (
    <>
      {/*!connected && <Redirect push to="/login" />*/}
      {connected && <Redirect push to="/dashboard" />}
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
          {!auth.isAuthenticated ? (
            <>
              <Link to={"/register"} className="nav-link">
                Register
              </Link>
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to={"/userList"} className="nav-link">
                Users
              </Link>
              <Link to={"/profile"} className="nav-link">
                My profile
              </Link>
            </>
          )}
        </Nav>
        {auth.isAuthenticated ? (
          <div>
            <span className="mr-2">Welcome {user.name.split(" ")[0]}!</span>

            <Button variant="dark" size="sm" onClick={onLogoutClick}>
              Logout
            </Button>
          </div>
        ) : (
          <Form inline onSubmit={onSubmit}>
            <Form.Row>
              <Form.Group className="mr-2">
                <Form.Label className="mr-2">Email</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  placeholder="Enter email"
                  onChange={(e: any) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                />
              </Form.Group>

              <Form.Group className="mr-2">
                <Form.Label className="mr-2">Password</Form.Label>
                <Form.Control
                  size="sm"
                  type="password"
                  placeholder="Password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  value={password}
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

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { logoutUser, loginUser })(Header);
