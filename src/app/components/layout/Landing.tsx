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
    return <div>Welcome</div>;
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Landing);
