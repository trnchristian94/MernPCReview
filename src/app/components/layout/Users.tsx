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

function Users({ auth, errors, history }: Props) {
  const [users, setUsers] = useState([]);
  const [stalkRequests, setStalkRequests] = useState([]);
  const { user } = auth;

  useEffect(() => {
    if (checkLogin(auth, history)) fetchStalkRequests();
  }, []);

  const fetchStalkRequests = () => {
    req.get(`/api/stalks/sent/${user.id}`, setStalkRequests);
    fetchUsers();
  };

  const fetchUsers = () => {
    req.get("/api/userList", setUsers);
  };

  const createUserList = () => {
    let content: any = [];
    let row: any = [];

    users.map((publicUser: any, i: number) => {
      const stalkReq: {
        _id: String;
        recipient: String;
        status: number;
      } = stalkRequests.find((f) => f.recipient === publicUser._id);

      row.push(
        <UserCard
          key={publicUser._id}
          user={publicUser}
          showAddButton={publicUser._id === user.id ? false : true}
          status={stalkReq ? stalkReq.status : 0}
          fetchUsers={fetchStalkRequests}
        />
      );

      if (((i + 1) % 1 === 0 && i !== 0) || i === users.length - 1) {
        content.push(<Row className="userCards">{row}</Row>);
        row = [];
      }
    });
    return content;
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div className="userCards">
          {/*createUserList()*/}
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
        </div>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Users);
