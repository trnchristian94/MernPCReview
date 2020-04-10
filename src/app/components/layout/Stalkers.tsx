import React, { useEffect, useState } from "react";
import UserCard from "components/layout/UserCard";
import { connect } from "react-redux";
import { requestGet } from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function Stalking({ auth, errors, history }: Props) {
  const [stalkers, setStalkers] = useState([]);
  const { user } = auth;
  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchStalking();
    }
  }, []);

  const fetchStalking = () => {
    requestGet("/api/stalks/stalkers/" + user.id, setStalkers);
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div>Stalkers :</div>
        <Row>
          {stalkers.map((publicUser: any) => {
            return (
              <UserCard
                key={publicUser._id}
                user={publicUser}
                showAddButton={false}
              />
            );
          })}
        </Row>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Stalking);
