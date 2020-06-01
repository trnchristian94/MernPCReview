import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import req from "utils/request";
import { useToasts } from "react-toast-notifications";

import BackLink from "layout/common/BackLink";
import LikeBar from "layout/common/LikeBar";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link, useHistory } from "react-router-dom";

import "./ComponentInfo.scss";

interface Props {
  auth: any;
  hardwareId: any;
}

function ComponentInfo({ auth, hardwareId }: Props) {
  const { addToast } = useToasts();
  const { user } = auth;
  const history = useHistory();
  const [hardware, setHardware]: any = useState();
  const [prevImage, setPrevImage] = useState();
  const prevHardware = () => {
    history.push("/hardware");
  };

  useEffect(() => {
    fetchHardware();
  }, []);

  const fetchHardware = () => {
    req.get(`/api/hardware/${hardwareId}`, setHardware);
  };

  const renderAltImages = () => {
    let ret = [];
    for (let i = 0; i < hardware.images.length; i++) {
      ret.push(
        <div
          key={i}
          className="pieceImage"
          onMouseEnter={() => setPrevImage(hardware.images[i].image)}
        >
          <img src={hardware.images[i].image} />
        </div>
      );
    }
    return ret;
  };

  if (hardware && !prevImage && hardware.images.length > 0)
    setPrevImage(hardware.images[0].image);
  return (
    <div id="componentInfo">
      <BackLink callback={prevHardware} />
      {hardware && (
        <>
          <Row>
            <Col className="leftCol" md={5}>
              <Row className="panelImg">
                <Col xs={2} className="altImages">
                  {renderAltImages()}
                </Col>
                <Col xs={10}>
                  <div className="principalImage">
                    <img src={prevImage} />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col className="centerCol" md={7}>
              <div className="pieceName">
                <h5>{hardware.name}</h5>
              </div>
              <div className="pieceCreator">
                <small>
                  added by{" "}
                  <Link
                    className="creator"
                    to={`/user/${hardware.creator.name}`}
                  >
                    {hardware.creator.name}
                  </Link>
                </small>
              </div>
              <LikeBar fetchHardware={fetchHardware} hardware={hardware} />
              <div className="reviewLength">0 Reviews // TO ADD</div>
              <div className="mb-2">
                <span className="piecePrice">Price: </span>
                <span className="pieceEuros">
                  {hardware.price.toFixed(2)} €
                </span>
              </div>
              <div>{hardware.description}</div>
            </Col>
          </Row>
          <div id="keepaCont" className="mt-3">
            <div id="keepaContainer">
              <iframe
                src={`https://keepa.com/#!search/9-${hardware.name.replace(
                  " ",
                  "%20"
                )}`}
                scrolling="yes"
                id="keepa"
              ></iframe>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth
});
export default connect(mapStateToProps)(ComponentInfo);
