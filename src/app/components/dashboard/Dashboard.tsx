import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "userLogic/actions/authActions";

type MyProps = {
  auth: any;
  logoutUser: any;
};
type MyState = {};
class Dashboard extends Component<MyProps, MyState> {
  onLogoutClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    const { user } = this.props.auth;
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                <span>🎉🎉 You are logged into a full-stack </span>
                <span style={{ fontFamily: "monospace" }}>MERN</span>
                <span> app 👏</span>
              </p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Dashboard);
