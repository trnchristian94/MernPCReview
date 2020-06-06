import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import req from "utils/request";
import { checkLogin } from "utils/connection";

import Container from "react-bootstrap/Container";

import UserCard from "layout/common/UserCard";

import "./HardwareUsers.scss";

interface Props {
  auth: any;
  match: any;
  history: any;
}
function HardwareUsers({ auth, match, history }: Props) {
  const [users, setUsers] = useState([]);
  const hardwareId = match.params.hardwareId;

  useEffect(() => {
    if (checkLogin(auth, history)) fetchHardwareUsers();
  }, [hardwareId,]);

  const fetchHardwareUsers = () => {
    req.get(`/api/hardware/${hardwareId}/users`, setUsers);
  };

  return (
    <Container
      id="hardwareUsers"
      className="pl-0 pr-0"
      fluid
      style={{ paddingTop: "4rem" }}
    >
      {users && (
      <div className="hardwareInSetup">{`Users with the same hardware in their setup`}</div>
    )}
      <div className="userCards">
        {users.map((us: any, key: any) => {
          return (
            <UserCard
              key={key}
              user={us}
              showAddButton={false}
              fetchUsers={fetchHardwareUsers}
            />
          );
        })}
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(HardwareUsers);
