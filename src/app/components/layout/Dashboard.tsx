import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "userLogic/actions/authActions";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
      <Container fluid style={{ maxWidth: "75%", paddingTop: "4rem" }}>
        <Row>
          <Col lg={true}>
            <h4>
              <b>Hey,</b> {user.name.split(" ")[0]}
              <p>
                <span>🎉🎉 You are welcome 👏</span>
              </p>
            </h4>
            <Button onClick={this.onLogoutClick}>Logout</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapStateToProps = (state: any) => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Dashboard);
