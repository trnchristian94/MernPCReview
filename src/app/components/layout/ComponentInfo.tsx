import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";

import { formatDate, formatHour, getTimeUntilNow } from "utils/date";
import req from "utils/request";

import Avatar from "@material-ui/core/Avatar";

import BackLink from "layout/common/BackLink";
import LikeBar from "layout/common/LikeBar";
import Delete from "@material-ui/icons/Delete";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Tooltip from "@material-ui/core/Tooltip";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useHistory } from "react-router-dom";

import hardwarePieces from "layout/common/hardwarePieces";

import "./ComponentInfo.scss";

interface Props {
  auth: any;
  hardwareId: any;
}

function ComponentInfo({ auth, hardwareId }: Props) {
  const { user } = auth;
  const history = useHistory();
  const [hardware, setHardware]: any = useState();
  const [hardwareReview, setHardwareReview] = useState("");
  const [reviewRate, setReviewRate] = useState(5);
  const [prevImage, setPrevImage] = useState();
  const [priceTracker, showPriceTracker] = useState(false);
  const { addToast } = useToasts();
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

  const goToProfile = (userName: string) => {
    history.push(`/user/${userName}`);
  };

  const submitReview = (e: any) => {
    e.preventDefault();
    if (reviewRate > 10 || reviewRate < 0) {
      return alert("Max review rate is 10, and minimum is 0");
    }
    if (hardwareReview.length < 20) {
      return alert("Minimum review length is 20 characters");
    }
    req.post(
      `/api/hardware/review/${hardware._id}`,
      { review: hardwareReview, reviewRate },
      fetchHardware,
      addToast
    );
  };

  const removeReview = (userId: string) => {
    if (confirm("Delete hardware review ?"))
      req.del(
        `/api/hardware/review/${hardware._id}`,
        fetchHardware,
        { userId },
        addToast
      );
  };

  const getAverageRate = () => {
    let totalRate = 0;
    for (let i = 0; i < hardware.reviews.length; i++) {
      totalRate += hardware.reviews[i].reviewRate;
    }
    return (totalRate / hardware.reviews.length).toFixed(2);
  };

  const renderDate = (d: Date, key: any) => {
    let ret = [];
    ret.push(
      <Tooltip key={key} title={`${formatDate(d)} ${formatHour(d)}`}>
        <span className="postDate">{getTimeUntilNow(d)}</span>
      </Tooltip>
    );
    return ret;
  };

  if (hardware && !prevImage && hardware.images.length > 0)
    setPrevImage(hardware.images[0].image);
  return (
    <div id="componentInfo">
      <BackLink
        callback={() => {
          history.push("/hardware");
        }}
      />
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
              <div className="pieceType">
                <span className="ml-2">{hardwarePieces[hardware.type]}</span>
              </div>
              {hardware.reviews.length > 0 && (
                <div className="reviewRate">
                  Average rate: {getAverageRate()} ({hardware.reviews.length}{" "}
                  Reviews)
                </div>
              )}

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
              <div className="mb-2">
                <span className="piecePrice">Price: </span>
                <span className="pieceEuros">
                  {hardware.price.toFixed(2)} €
                </span>
              </div>
              <div>{hardware.description}</div>
            </Col>
          </Row>
          <Button
            className="roundBtn my-2"
            onClick={() => showPriceTracker(!priceTracker)}
          >
            Price tracker
            <LocalOfferIcon />
          </Button>
          {priceTracker && (
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
          )}
          <Form className="mb-3 reviewForm" onSubmit={submitReview}>
            <Form.Label>Rate</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={reviewRate}
              style={{ width: "65px" }}
              onChange={(e: any) => setReviewRate(e.target.value)}
              onFocus={(e: any) => e.target.select()}
              required
            />
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Write a review:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="5"
                  type="text"
                  name="review"
                  placeholder={`This ${hardware.name} is the best...`}
                  value={hardwareReview}
                  onChange={(e: any) => setHardwareReview(e.target.value)}
                  required
                />
              </Form.Group>
            </Form.Row>

            <Button type="submit" className="mr-3">
              Submit review
            </Button>
          </Form>
          <div className="reviews">
            {hardware.reviews.length > 0 &&
              hardware.reviews.map((review: any, key: number) => {
                return (
                  <div className="review" key={key}>
                    <div className="review__header">
                      {review.user.userImage && (
                        <Avatar
                          alt={`${review.user.name} profile image`}
                          className="avatarImg"
                          src={review.user.userImage.image}
                          onClick={() => goToProfile(review.user.name)}
                        />
                      )}
                      <div
                        onClick={() => goToProfile(review.user.name)}
                        className="user"
                      >
                        @{review.user.name}
                      </div>
                      <div className="rate">
                        (Rated with <span>{review.reviewRate}</span>)
                      </div>

                      {renderDate(review.date, key)}
                    </div>
                    <div className="review__body">{review.review}</div>
                    <div className="review__actions">
                      {(review.user._id === user.id ||
                        user.permission === "admin") && (
                        <Delete
                          className="delete"
                          onClick={() => removeReview(review.user._id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
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
