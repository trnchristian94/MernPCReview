import React, { useEffect, useState } from "react";
import UserCard from "layout/common/UserCard";
import req from "utils/request";
import { checkLogin } from "utils/connection";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
    if (checkLogin(auth, history)) fetchStalkerRequests();
  }, []);

  const fetchStalkerRequests = () => {
    req.get(`/api/stalks/received/${user.id}`, setStalkerRequests);
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <h3>Stalker requests</h3>
        <div className="userCards">
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
        </div>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(StalkerRequests);
