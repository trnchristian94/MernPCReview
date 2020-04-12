import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import UserCard from "components/layout/UserCard";
import { requestGet } from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
    requestGet(`/api/stalks/sent/${user.id}`, setStalkRequests);
    fetchUsers();
  };

  const fetchUsers = () => {
    requestGet("/api/userList", setUsers);
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <Row className="userCards">
          {users.map((publicUser: any) => {
            const stalkReq: {
              _id: String;
              recipient: String;
              status: number;
            } = stalkRequests.find((f) => f.recipient === publicUser._id);
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
