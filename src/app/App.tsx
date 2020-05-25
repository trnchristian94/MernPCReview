import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "src/store";

import Sidebar from "core/Sidebar";
import StalkerRequests from "core/StalkerRequests";
import Landing from "layout/Home";
import Users from "layout/Users";
import MyProfile from "src/app/components/layout/MyProfile";
import Stalks from "layout/common/Stalks";
import LoadingBar from "layout/common/LoadingBar";
import Notifications from "src/app/components/layout/Notifications";
import Hardware from "src/app/components/layout/Hardware";

import Register from "components/auth/Register";
import Login from "components/auth/Login";
import PrivateRoute from "components/private-route/PrivateRoute";
import Dashboard from "layout/Dashboard";

import jwt_decode from "jwt-decode";
import setAuthToken from "utils/setAuthToken";
import { setCurrentUser, logoutUser } from "userLogic/actions/authActions";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./App.scss";

import { ToastProvider } from "react-toast-notifications";
import Profile from "layout/common/Profile";
// Check for token to keep user logged in

if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const user: any = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(user));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (user.exp < currentTime) {
    // Logout user
    store.dispatch<any>(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

export default class App extends Component {
  render() {
    return (
      <ToastProvider>
        <Provider store={store}>
          <Container fluid className="App">
            <Row>
              {/* Navigation */}
              <Router>
                <LoadingBar />
                <Col xs={3} id="sidebarCol">
                  <Sidebar />
                </Col>
                <Col xs={6} className='p-0' id="midCol">
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/userList" component={Users} />
                  <Route exact path="/profile" component={MyProfile} />
                  <Route exact path="/stalking" component={Stalks} />
                  <Route exact path="/stalkers" component={Stalks} />
                  <Route exact path="/hardware" component={Hardware} />
                  <Route
                    exact
                    path="/notifications"
                    component={Notifications}
                  />
                  <Route exact path={`/user/:username`} component={Profile} />
                  <Route exact path={`/user/:username/likes`} component={Profile} />
                  <Route exact path={`/user/:username/stalking`} component={Stalks} />
                  <Route exact path={`/user/:username/stalkers`} component={Stalks} />
                  <Route
                    exact
                    path="/stalkerRequests"
                    component={StalkerRequests}
                  />
                  <Switch>
                    <PrivateRoute
                      exact
                      path="/dashboard"
                      Component={Dashboard}
                    />
                  </Switch>
                </Col>
                <Col xs={3} id="rightCol"></Col>
              </Router>
            </Row>
          </Container>
        </Provider>
      </ToastProvider>
    );
  }
}
