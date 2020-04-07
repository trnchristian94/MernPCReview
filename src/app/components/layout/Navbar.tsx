import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { loginUser, logoutUser } from "userLogic/actions/authActions";
import { getStalkRequests } from "userLogic/actions/stalkRequestActions";
import Post from "components/layout/Post";

import { useToasts } from "react-toast-notifications";

import { Link, useHistory, withRouter } from "react-router-dom";

import { Navbar, Nav, Form, Button } from "react-bootstrap";

import {
  AddRounded,
  HomeRounded,
  PlaylistAddCheckRounded,
  GroupRounded,
  AccountCircleRounded,
  PowerOffRounded,
} from "@material-ui/icons";
interface Props {
  auth: any;
  stalks: any;
  loginUser: any;
  logoutUser: any;
  getStalkRequests: any;
  errors: any;
}

function NavbarHeader({
  auth,
  loginUser,
  logoutUser,
  getStalkRequests,
  errors,
  stalks
}: Props) {
  const { addToast } = useToasts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [showSubmitPost, setShowSubmitPost] = useState(false);
  //const [stalkRequests, setStalkRequests] = useState(0);
  const stalkReq = stalks.stalkRequests;
  const { user } = auth;
  const history = useHistory();

  useEffect(() => {
    if (auth.isAuthenticated) {
      setConnected(true);
      addToast("You logged in succesfully", {
        appearance: "success",
        autoDismiss: true
      });
      getStalkRequests(user);
    }
  }, [auth.isAuthenticated]);

  const onLogoutClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    logoutUser();
    setConnected(false);
    history.push("/");
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

  return (
    <>
      {/*!connected && <Redirect push to="/login" />*/}
      {/*connected && <Redirect push to="/dashboard" />*/}
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
            <HomeRounded />
            Home
          </Link>
          <Link to={"/tasks"} className="nav-link">
            <PlaylistAddCheckRounded />
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
                <GroupRounded />
                Users
              </Link>
              <Link
                to={"/profile"}
                className="nav-link"
                onClick={() => getStalkRequests(user)}
              >
                <AccountCircleRounded />
                My profile
              </Link>
              {stalkReq > 0 && (
                <Link
                  to={"/stalkerRequests"}
                  className="nav-link stalkerRequests"
                >
                  Stalker Requests : {stalkReq}
                </Link>
              )}
            </>
          )}
        </Nav>
        {auth.isAuthenticated ? (
          <>
            <Button
              onClick={() => setShowSubmitPost(!showSubmitPost)}
              style={{
                marginRight: "100px",
                width: "120px",
                borderRadius: "20px",
              }}
            >
              <span style={{ paddingRight: "5px" }}>Post</span>
              <AddRounded />
            </Button>
            <div>
              <span className="mr-2">Welcome {user.name.split(" ")[0]}!</span>
              <Button variant="dark" size="sm" onClick={onLogoutClick}>
                <PowerOffRounded />
                Logout
              </Button>
            </div>
          </>
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
      {auth.isAuthenticated && showSubmitPost && (
        <Post setShowSubmitPost={setShowSubmitPost} />
      )}
    </>
  );
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
  stalks: state.stalks
});
export default withRouter(
  connect(mapStateToProps, { logoutUser, loginUser, getStalkRequests })(
    NavbarHeader
  )
);
