import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { requestGet, requestPut } from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function Notifications({ auth, errors, history }: Props) {
  const { addToast } = useToasts();
  const { user } = auth;

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
    }
  }, []);

  return (
    <Container style={{ paddingTop: "4rem" }}>
      <Col lg={true}>Notification</Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Notifications);
