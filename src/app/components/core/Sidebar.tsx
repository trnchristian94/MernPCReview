import React, { useState, useEffect, useCallback } from "react";

import { connect } from "react-redux";
import { loginUser, logoutUser } from "userLogic/actions/authActions";
import { getStalkRequests } from "userLogic/actions/stalkRequestActions";
import { getNewNotifications } from "userLogic/actions/notificationActions";
import Post from "layout/common/Post";

import { useToasts } from "react-toast-notifications";

import { getUrlDir } from "utils/string";

import { Link, useHistory, withRouter } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import Create from "@material-ui/icons/Create";
import HomeRounded from "@material-ui/icons/HomeRounded";
import GroupRounded from "@material-ui/icons/GroupRounded";
import AccountCircleRounded from "@material-ui/icons/AccountCircleRounded";
import PowerOffRounded from "@material-ui/icons/PowerOffRounded";
import NotificationsNone from "@material-ui/icons/NotificationsNone";
import Notifications from "@material-ui/icons/Notifications";
import DesktopWindows from "@material-ui/icons/DesktopWindows";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";

import Avatar from "@material-ui/core/Avatar";

import "./Sidebar.scss";
import { setUrl } from "src/userLogic/actions/urlActions";

interface Props {
  auth: any;
  stalks: any;
  newNotifications: any;
  loginUser: any;
  logoutUser: any;
  getStalkRequests: any;
  getNewNotifications: any;
  errors: any;
}

function Sidebar({
  auth,
  loginUser,
  logoutUser,
  getStalkRequests,
  getNewNotifications,
  stalks,
  newNotifications
}: Props) {
  const { addToast } = useToasts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [showSubmitPost, setShowSubmitPost] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const stalkReq = stalks.stalkRequests;
  const newNotifs = newNotifications.newNotifications;
  const { user } = auth;
  const history = useHistory();

  useEffect(() => {
    if (auth.isAuthenticated) {
      setConnected(true);
      addToast("You logged in succesfully", {
        appearance: "success",
        autoDismiss: true
      });
    }
  }, [auth.isAuthenticated]);

  // Fetch the amounts every time user changes menu
  const fetchAmounts = () => {
    if (auth.isAuthenticated) {
      getStalkRequests(user);
      getNewNotifications(user);
    }
  };

  const routeChanged = useCallback(() => {}, [location.pathname]);
  useEffect(() => {
    setShowLoginForm(getUrlDir(1) !== "login");
    if (auth.isAuthenticated) {
      fetchAmounts();
    }
  }, [routeChanged]);

  const onLogoutClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setUrl(location.pathname);
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

  const createLink = (linkTo: string, navText: string, icon: any) => {
    let ret = [];
    ret.push(
      <Link key={linkTo} to={`/${linkTo}`} className="nav-link">
        <div className="sidebar-link">
          {icon}
          <span className="navText">{navText}</span>
        </div>
      </Link>
    );
    return ret;
  };

  return (
    <div id="sidebar" className="float-right sticky-top">
      <Link to={"/"} id="brandName" className="nav-link">
        <div className="mAlign">
          <span className="navText">The PC Review</span>
        </div>
        <div className="mAlign">
          <img
            src="https://res.cloudinary.com/dz6ogknjd/image/upload/v1583751665/favicon/favicon.ico"
            title="PC Review Icon"
          />
        </div>
      </Link>
      {createLink("", "Home", <HomeRounded />)}
      {!auth.isAuthenticated ? (
        <>
          {createLink("register", "Register", <PersonOutlineIcon />)}
          {createLink("login", "Login", <VpnKeyIcon />)}
        </>
      ) : (
        <>
          {createLink("userList", "Users", <GroupRounded />)}
          {createLink("hardware", "Hardware", <DesktopWindows />)}
          {createLink("profile", "My profile", <AccountCircleRounded />)}
          <Link
            to={"/notifications"}
            className="nav-link"
            style={{ position: "relative" }}
          >
            <div className="sidebar-link notif-link">
              {newNotifs > 0 ? (
                <>
                  <Notifications />
                  <div className="notificationBubble rounded">
                    <span className="newNotifications">{newNotifs}</span>
                  </div>
                </>
              ) : (
                <NotificationsNone />
              )}
              <span className="navText">Notifications</span>
            </div>
          </Link>
          {stalkReq > 0 && (
            <Link to={"/stalkerRequests"} className="nav-link stalkerRequests">
              <div className="sidebar-link stalkRequests">
                Stalker Requests {stalkReq}
              </div>
            </Link>
          )}
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
            <div className="navText mAlign">
              Welcome {user.name.split(" ")[0]}!
            </div>
            {user.permission !== "user" && (
              <div className="mAlign permission"> {user.permission}</div>
            )}
            {user.userImage && (
              <Avatar
                alt={`${user.name} profile image`}
                className="avatarImg"
                src={user.userImage}
                onClick={() => history.push("/profile")}
              />
            )}
            <div className="mAlign">
              <Button variant="dark" size="sm" onClick={onLogoutClick}>
                <PowerOffRounded />
                <span className="navText">Logout</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        showLoginForm && (
          <Form className="loginForm" onSubmit={onSubmit}>
            <Form.Row>
              <Form.Group className="mr-2">
                <Form.Label className="mr-2">Email</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  placeholder="Enter email"
                  onChange={(e: any) => setEmail(e.target.value)}
                  value={email}
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
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Button variant="dark" type="submit" size="sm">
                Login
              </Button>
            </Form.Row>
          </Form>
        )
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
  stalks: state.stalks,
  newNotifications: state.newNotifications
});
export default withRouter(
  connect(mapStateToProps, {
    logoutUser,
    loginUser,
    getStalkRequests,
    getNewNotifications,
    setUrl
  })(Sidebar)
);
