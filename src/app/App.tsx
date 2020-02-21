import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "src/store";

import Navbar from "src/app/components/layout/Navbar";
import Landing from "src/app/components/layout/Landing";
import Task from "components/layout/Task";
import UserList from "components/layout/UserList";

import Register from "components/auth/Register";
import Login from "components/auth/Login";
import PrivateRoute from "components/private-route/PrivateRoute";
import Dashboard from "components/dashboard/Dashboard";

import jwt_decode from "jwt-decode";
import setAuthToken from "utils/setAuthToken";
import { setCurrentUser, logoutUser } from "userLogic/actions/authActions";

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
      <Provider store={store}>
        <div>
          {/* Navigation */}

          <div>
            <Router>
              <div className="App">
                <Navbar />
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/tasks" component={Task} />
                <Route exact path="/userList" component={UserList} />
                <Switch>
                  <PrivateRoute exact path="/dashboard" Component={Dashboard} />
                </Switch>
              </div>
            </Router>
          </div>
        </div>
      </Provider>
    );
  }
}