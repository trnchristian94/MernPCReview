import React, { useEffect, useState } from "react";
import req from "utils/request";
import { checkLogin } from "utils/connection";
import { getUrlDir } from "utils/string";

import UserCard from "layout/common/UserCard";
import BackLink from "layout/common/BackLink";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { Link } from "react-router-dom";

import { connect } from "react-redux";

import "./Stalks.scss";

interface Props {
  auth: any;
  errors: any;
  history: any;
  match: any;
}

function Stalks({ auth, errors, history, match }: Props) {
  const [stalks, setStalks] = useState([]);
  const { user } = auth;
  const [stalkType, setStalkType] = useState("");

  useEffect(() => {
    if (checkLogin(auth, history)) getLocationAndStalk();
  }, []);

  const getLocationAndStalk = () => {
    const direction = getUrlDir(1);
    setStalkType(direction);
    fetchStalking(direction);
  };

  const fetchStalking = (stalkType: string) => {
    if (match.params.username) {
      new Promise((resolve, reject) => {
        req.get(`/api/userProfile/getUserId/${match.params.username}`, resolve);
      }).then((u: any) => {
        req.get(`/api/stalks/${stalkType}/${u[0]._id}`, setStalks);
      });
    } else {
      req.get(`/api/stalks/${stalkType}/${user.id}`, setStalks);
    }
  };

  return (
    <Container id="stalks" fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div className="stalkType">
          {stalkType}{" "}
          {match.params.username ? ` - @${match.params.username}` : ""}:
        </div>
        <BackLink
          callback={() => {
            history.push(
              `/user/${
                match.params.username ? match.params.username : user.name
              }`
            );
          }}
        />
        <div className="userCards">
          {stalks.map((publicUser: any, key: any) => {
            return (
              <UserCard
                key={key}
                user={publicUser}
                showAddButton={
                  publicUser._id === user.id ||
                  stalkType === "stalkers" ||
                  (match.params.username && match.params.username !== user.name)
                    ? false
                    : true
                }
                status={2}
                fetchUsers={getLocationAndStalk}
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
export default connect(mapStateToProps)(Stalks);
