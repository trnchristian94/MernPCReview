import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

interface Props {
  component: any;
  auth: any;
  [x: string]: any;
}
// { component } : Props
function PrivateRoute({ Component, auth, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={props => {
        console.log(props);
        return auth.isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
const mapStateToProps = (state: any) => {
  const { auth } = state;
  return { auth };
};
export default connect(mapStateToProps)(PrivateRoute);
