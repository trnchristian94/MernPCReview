import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import UserCard from "components/layout/UserCard";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function UserList({ auth, errors, history }: Props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = () => {
    fetch("/api/userList", {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      });
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <Row>
          {users.map((user: any) => {
            return <UserCard key={user._id} user={user} showAddButton={true} />;
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
export default connect(mapStateToProps)(UserList);
