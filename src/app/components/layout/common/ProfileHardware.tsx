import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import req from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import UserPosts from "./UserPosts";
import { getUserPosts } from "userLogic/actions/userPostActions";

import { getUrlDir } from "utils/string";
import { Link } from "react-router-dom";

import "./ProfileHardware.scss";

interface Props {
  auth: any;
  match: any;
  history: any;
}

const hardwarePieces: any = {
  mobo: "Motherboard",
  cpu: "CPU",
  hdd: "Hard Drive Disk",
  ssd: "Solid State Drive",
  gpu: "Graphic Card",
  ram: "Memory RAM",
  optic: "Optical Drive",
  soundcard: "Soundcard",
  case: "Case",
  psu: "Power Supply",
  etc: "Others"
};

function ProfileHardware({ auth, match, history }: Props) {
  const [publicUser, setUser]: any = useState();
  const [userHardware, setUserHardware] = useState([]);
  const { user } = auth;
  const username = match.params.username;
  const direction = getUrlDir(1);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUserHardware();
    }
  }, [username]);

  const fetchUserHardware = () => {
    new Promise((resolve, reject) => {
      req.get("/api/userProfile/user/" + username, resolve);
    }).then((u: any) => {
      setUser(u[0]);
      req.get(
        `/api/hardware/lookForSetup/${user.id}?user=${u[0]._id}`,
        setUserHardware
      );
    });
  };
  
  const getHardwarePrice = () => {
    let price = 0;
    for(let i = 0 ; i < userHardware.length ; i++ ){
      price += userHardware[i].price;
    }
    return <span className="price">Total hardware value: {price.toFixed(2)} €</span>
  }

  return (
    <Container
      id="profileHardware"
      className="pl-0 pr-0"
      fluid
      style={{ paddingTop: "4rem" }}
    >
      <div>
        {publicUser && <div className="pcComponents">{`${publicUser.name}'s PC Components`}</div>}
        <div className="hardwareList">
          {userHardware &&
            userHardware.map((hardware: any) => {
              return (
                <div className="hardware" key={hardware._id}>
                  <div className="pieceType">
                      {hardware.type && hardwarePieces[hardware.type]}
                  </div>
                  <div className="pieceName">
                    {hardware.name}
                  </div>
                  <div className="pieceImage">
                    {hardware.images && hardware.images.length > 0 && (
                      <img src={hardware.images[0].image} />
                    )}
                  </div>
                </div>
              );
            })}
            {getHardwarePrice()}
        </div>
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(ProfileHardware);
