import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useToasts } from "react-toast-notifications";

import UserCard from "layout/common/UserCard";

import PicCropUpload from "utils/picCropUpload";
import { requestGet, requestPut } from "utils/request";
import { formatDate } from "utils/date";


import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function MyProfile({ auth, errors, history }: Props) {
  const { addToast } = useToasts();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [date, setDate] = useState("");
  const [userImage, setUserImage] = useState({
    image: "",
    imageId: "",
  });

  const [userLandscape, setUserLandscape] = useState({
    landscape: "",
    landscapeId: "",
  });
  const [image, setImage] = useState();
  const [croppedImage, setCroppedImage] = useState(null);
  const [landscapeForm, setlandscapeForm] = useState(false);
  const [imageForm, setImageForm] = useState(false);
  const [id, setId] = useState("");
  const [stalkers, setStalkers] = useState(0);
  const [stalking, setStalking] = useState(0);

  const { user } = auth;

  const fetchUser = () => {
    fetch("/api/userProfile/" + user.id, {
      headers: {
        Authorization: localStorage.jwtToken,
      },
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
          imageId: data.userImage ? data.userImage.imageId : "",
        });
        setUserLandscape({
          landscape: data.userImage.landscape ? data.userImage.landscape : "",
          landscapeId: data.userImage.landscapeId
            ? data.userImage.landscapeId
            : "",
        });
        setId(data._id);
      });
  };

  const editUser = (e: any) => {
    e.preventDefault();
    requestPut(
      `/api/userProfile/updateUser/${id}`,
      {
        name: userName,
        email,
        userInfo: { bio: bio },
      },
      addToast
    );
  };

  const fetchStalks = () => {
    requestGet(`/api/stalks/stalkers/${user.id}/amount`, setStalkers);
    requestGet(`/api/stalks/stalking/${user.id}/amount`, setStalking);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
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
                landscape: userLandscape.landscape,
              },
              userInfo: { bio: bio },
            }}
            showAddButton={false}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
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
            id={id}
          />
        )}
        {imageForm && (
          <PicCropUpload
            setCroppedImage={setCroppedImage}
            landscape={false}
            addToast={addToast}
            fetchUser={fetchUser}
            id={id}
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
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps)(MyProfile);
