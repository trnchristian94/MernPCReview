import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserCard from "components/layout/UserCard";
import { requestGet } from "utils/request";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

// Buscar a quien sigue el usuario.
// Filtrar usuarios por estos a los que sigue (desde la parte back)
function StalkerRequests({ auth, errors, history }: Props) {
  const [stalkerRequests, setStalkerRequests] = useState([]);
  const { user } = auth;
  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchStalkerRequests();
    }
  }, []);

  const fetchStalkerRequests = () => {
    requestGet("/api/stalks/received/" + user.id, setStalkerRequests);
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div>Stalker requests :</div>
        <Row>
          {stalkerRequests.map((publicUser: any) => {
            return (
              <UserCard
                key={publicUser._id}
                user={publicUser}
                showAddButton={publicUser._id === user.id ? false : true}
                status={1}
                fetchUsers={fetchStalkerRequests}
                stalker={true}
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
export default connect(mapStateToProps)(StalkerRequests);
