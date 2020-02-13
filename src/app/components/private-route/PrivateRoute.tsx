import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

interface Props {
  component: any;
  auth: any;
  [x: string]: any;
}
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
