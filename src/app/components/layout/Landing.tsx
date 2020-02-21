import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

type MyProps = {
  auth: any;
  errors: any;
};
type MyState = {};
class Landing extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <br />
            {!this.props.auth.isAuthenticated && (
              <div className="col">
                <Link
                  to="/register"
                  style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                  }}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Register
                </Link>
              </div>
            )}
            {!this.props.auth.isAuthenticated && (
              <div className="col">
                <Link
                  to="/login"
                  style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                  }}
                  className="btn btn-large btn-flat waves-effect white black-text"
                >
                  Log In
                </Link>
              </div>
            )}
            <div className="col">
              <Link
                to="/tasks"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Tasks
              </Link>
            </div>
            {this.props.auth.isAuthenticated && (
              <div className="col">
                <Link
                  to="/userList"
                  style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                  }}
                  className="btn btn-large btn-flat waves-effect white black-text"
                >
                  Users
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Landing);
