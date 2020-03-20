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
  const [stalkRequests, setStalkRequests] = useState([]);
  const { user } = auth;

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchStalkRequests();
    }
  }, []);

  const fetchStalkRequests = () => {
    fetch("/api/stalks/sent/" + user.id, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setStalkRequests(data);
        fetchUsers();
      });
  };

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
          {users.map((publicUser: any) => {
            const stalkReq: {
              _id: String;
              recipient: String;
              status: number;
            } = stalkRequests.find(f => f.recipient === publicUser._id);
            return (
              <UserCard
                key={publicUser._id}
                user={publicUser}
                showAddButton={publicUser._id === user.id ? false : true}
                status={stalkReq ? stalkReq.status : 0}
                fetchUsers={fetchStalkRequests}
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
export default connect(mapStateToProps)(UserList);
