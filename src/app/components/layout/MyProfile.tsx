import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";

import UserCard from "layout/common/UserCard";

import PicCropUpload from "utils/picCropUpload";
import req from "utils/request";
import { formatDate } from "utils/date";
import { checkLogin } from "utils/connection";

import { changeProfileImg } from "userLogic/actions/authActions";
import { logoutUser } from "userLogic/actions/authActions";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { connect } from "react-redux";

interface Props {
  auth: any;
  history: any;
  changeProfileImg: any;
  logoutUser: any;
}

function MyProfile({ auth, history, changeProfileImg, logoutUser }: Props) {
  const { addToast } = useToasts();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [date, setDate] = useState("");
  const [userImage, setUserImage] = useState({
    image: "",
    imageId: ""
  });

  const [userLandscape, setUserLandscape] = useState({
    landscape: "",
    landscapeId: ""
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [landscapeForm, setlandscapeForm] = useState(false);
  const [imageForm, setImageForm] = useState(false);
  const [stalkers, setStalkers] = useState(0);
  const [stalking, setStalking] = useState(0);
  const conf = "You will deactivate your account, after 30 days it will be deleted. As long as your account remains deactivated other users will not have access to your posts or your basic information. If you log in again your account will be reactivated and all your data will be visible again.";

  const { user } = auth;

  const fetchUser = () => {
    fetch("/api/userProfile/" + user.id, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.name);
        setEmail(data.email);
        setDate(data.date);
        setEmail(data.email);
        setBio(data.userInfo ? data.userInfo.bio : "");
        setUserImage({
          image: data.userImage ? data.userImage.image : "",
          imageId: data.userImage ? data.userImage.imageId : ""
        });
        changeProfileImg(data.userImage.image);
        setUserLandscape({
          landscape: data.userImage.landscape ? data.userImage.landscape : "",
          landscapeId: data.userImage.landscapeId
            ? data.userImage.landscapeId
            : ""
        });
      });
  };

  const editUser = (e: any) => {
    e.preventDefault();
    req.put(
      `/api/userProfile/updateUser/${user.id}`,
      {
        name: userName,
        email,
        userInfo: { bio: bio }
      },
      null,
      addToast
    );
  };

  const fetchStalks = () => {
    req.get(`/api/stalks/stalkers/${user.id}/amount`, setStalkers);
    req.get(`/api/stalks/stalking/${user.id}/amount`, setStalking);
  };

  const deactivateAccout = () => {

    if(confirm(conf)){
      const callback = () => {
        logoutUser();
        history.push("/");
      };
      req.put(`/api/userProfile/deactivate/${user.id}`, null, callback, addToast);
    }
  };

  useEffect(() => {
    if (checkLogin(auth, history)) {
      fetchUser();
      fetchStalks();
    }
  }, []);

  return (
    <Container style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <UserCard
            user={{
              name: userName,
              userImage: {
                image: userImage.image,
                landscape: userLandscape.landscape
              },
              userInfo: { bio: bio }
            }}
            showAddButton={false}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px"
          }}
        >
          <Link to={"/stalkers"} className="nav-link">
            Stalkers: {stalkers}
          </Link>
          <Link to={"/stalking"} className="nav-link">
            Stalking: {stalking}
          </Link>
        </div>
        <br />
        <Button onClick={() => setlandscapeForm(!landscapeForm)}>
          Upload new landscape Image
        </Button>
        <br />
        <Button onClick={() => setImageForm(!imageForm)}>
          Upload new profile Image
        </Button>
        <br />
        {landscapeForm && (
          <PicCropUpload
            setCroppedImage={setCroppedImage}
            landscape={true}
            addToast={addToast}
            fetchUser={fetchUser}
            id={user.id}
          />
        )}
        {imageForm && (
          <PicCropUpload
            setCroppedImage={setCroppedImage}
            landscape={false}
            addToast={addToast}
            fetchUser={fetchUser}
            id={user.id}
          />
        )}
        <Form noValidate onSubmit={editUser}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e: any) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Biography</Form.Label>
              <Form.Control
                type="text"
                placeholder="Biography/Status/Hobbies/etc"
                value={bio}
                onChange={(e: any) => setBio(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>
          User joined {formatDate(date)} <br />
          <Button type="submit">Save profile</Button>
        </Form>
        <Button variant="danger" onClick={() => deactivateAccout()}>
          Deactivate my account
        </Button>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { changeProfileImg, logoutUser })(
  MyProfile
);
