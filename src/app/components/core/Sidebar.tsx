import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { loginUser, logoutUser } from "userLogic/actions/authActions";
import { getStalkRequests } from "userLogic/actions/stalkRequestActions";
import Post from "layout/common/Post";

import { useToasts } from "react-toast-notifications";

import { Link, useHistory, withRouter } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import Create from "@material-ui/icons/Create";
import HomeRounded from "@material-ui/icons/HomeRounded";
import PlaylistAddCheckRounded from "@material-ui/icons/PlaylistAddCheckRounded";
import GroupRounded from "@material-ui/icons/GroupRounded";
import AccountCircleRounded from "@material-ui/icons/AccountCircleRounded";
import PowerOffRounded from "@material-ui/icons/PowerOffRounded";
import PermMedia from "@material-ui/icons/PermMedia";
import NotificationsNone from "@material-ui/icons/NotificationsNone";

import "./Sidebar.scss";

interface Props {
  auth: any;
  stalks: any;
  loginUser: any;
  logoutUser: any;
  getStalkRequests: any;
  errors: any;
}

function Sidebar({
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
    history.push("/login");
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
    <div id="sidebar" className="float-right sticky-top">
      <Link to={"/"} className="nav-link">
        <span className="navText">The PC Review</span>
      </Link>
      <Link to={"/"} className="nav-link">
        <HomeRounded />
        <span className="navText">Home</span>
      </Link>
      <Link to={"/tasks"} className="nav-link">
        <PlaylistAddCheckRounded />
        <span className="navText">Tasks</span>
      </Link>
      {!auth.isAuthenticated ? (
        <>
          <Link to={"/register"} className="nav-link">
            <span className="navText">Register</span>
          </Link>
          <Link to={"/login"} className="nav-link">
            <span className="navText">Login</span>
          </Link>
        </>
      ) : (
        <>
          <Link to={"/images"} className="nav-link">
            <PermMedia />

            <span className="navText">Images</span>
          </Link>
          <Link to={"/userList"} className="nav-link">
            <GroupRounded />
            <span className="navText">Users</span>
          </Link>
          <Link
            to={"/profile"}
            className="nav-link"
            onClick={() => getStalkRequests(user)}
          >
            <AccountCircleRounded />

            <span className="navText">My profile</span>
          </Link>
          {stalkReq > 0 && (
            <Link to={"/stalkerRequests"} className="nav-link stalkerRequests">
              Stalker Requests : {stalkReq}
            </Link>
          )}
          <Link to={"/notifications"} className="nav-link">
            <NotificationsNone />

            <span className="navText">Notifications</span>
          </Link>
        </>
      )}
      {auth.isAuthenticated ? (
        <>
          <div className="mAlign" style={{ marginBottom: "10px" }}>
            <Button
              className="postBtn"
              onClick={() => setShowSubmitPost(!showSubmitPost)}
            >
              <span className="navText" style={{ paddingRight: "5px" }}>
                Post
              </span>
              <Create />
            </Button>
          </div>
          <div>
            <div className="navText mr-2 mAlign">
              Welcome {user.name.split(" ")[0]}!
            </div>
            <div className="mAlign">
              <Button variant="dark" size="sm" onClick={onLogoutClick}>
                <PowerOffRounded />
                <span className="navText">Logout</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Form onSubmit={onSubmit}>
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
          </Form.Row>
          <Form.Row>
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
          </Form.Row>

          <Form.Row>
            <Button variant="dark" type="submit" size="sm">
              Login
            </Button>
          </Form.Row>
        </Form>
      )}
      {auth.isAuthenticated && showSubmitPost && (
        <Post setShowSubmitPost={setShowSubmitPost} />
      )}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
  stalks: state.stalks
});
export default withRouter(
  connect(mapStateToProps, { logoutUser, loginUser, getStalkRequests })(Sidebar)
);
