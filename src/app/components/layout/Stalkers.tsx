import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserCard from "components/layout/UserCard";
import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

// Buscar a quien sigue el usuario.
// Filtrar usuarios por estos a los que sigue (desde la parte back)
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
    fetch("/api/stalks/stalkers/" + user.id, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setStalkers(data);
      });
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
          <div>Stalkers :</div>
        <Row>
          {stalkers.map((publicUser: any) => {
            return <UserCard key={publicUser._id} user={publicUser} showAddButton={false} />;
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
