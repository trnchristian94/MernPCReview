import React, { useEffect, useState } from "react";
import req from "utils/request";

import UserCard from "layout/common/UserCard";

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
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      getLocationAndStalk();
    }
  }, []);

  const getLocationAndStalk = () => {
    let direction =
      location.pathname.substr(location.pathname.length - 1) === "/"
        ? location.pathname.substr(0, location.pathname.length - 1)
        : location.pathname;
    direction = direction.substr(
      direction.lastIndexOf("/") + 1,
      direction.length
    );
    setStalkType(direction);
    fetchStalking(direction);
  };

  const fetchStalking = (stalkType: string) => {
    if (match.params.username) {
      new Promise((resolve, reject) => {
        req.get(
          `/api/userProfile/getUserId/${match.params.username}`,
          resolve
        );
      }).then((u: any) => {
        req.get(`/api/stalks/${stalkType}/${u[0]._id}`, setStalks);
      });
    } else {
      req.get(`/api/stalks/${stalkType}/${user.id}`, setStalks);
    }
  };

  const renderArrowBack = () => {
    let ret = [];
    ret.push(
      <Link
        className="goBackLink"
        to={`/user/${
          match.params.username ? match.params.username : user.name
        }`}
      >
        <ArrowBackIcon className="arrowBack" />
        <span>Return</span>
      </Link>
    );
    return ret;
  };

  return (
    <Container id="stalks" fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div className="stalkType">{stalkType} {match.params.username?` - @${match.params.username}`:""}:</div>
        {renderArrowBack()}
        <div className="userCards">
          {stalks.map((publicUser: any, key: any) => {
            return (
                <UserCard
                  key={key}
                  user={publicUser}
                  showAddButton={publicUser._id === user.id || stalkType==="stalkers" || match.params.username? false : true}
                  status={2}
                  fetchUsers={fetchStalking}
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
