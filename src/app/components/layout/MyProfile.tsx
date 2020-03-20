import React, { useEffect, useState } from "react";
import { Container, Form, Col, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";
import UserCard from "components/layout/UserCard";
import PicCropUpload from "utils/picCropUpload";

import { formatDate } from "utils/date";

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
    imageId: ""
  });
  const [image, setImage] = useState();
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageForm, setImageForm] = useState(false);
  const [id, setId] = useState("");
  const [stalkers, setStalkers] = useState(0);
  const [stalking, setStalking] = useState(0);

  const { user } = auth;

  const fetchUser = () => {
    fetch("/api/userProfile/" + user.id, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsername(data.name);
        setEmail(data.email);
        setDate(data.date);
        setEmail(data.email);
        setBio(data.userInfo ? data.userInfo.bio : "");
        setUserImage({
          image: data.userImage ? data.userImage.image : "",
          imageId: data.userImage ? data.userImage.imageId : ""
        });
        setId(data._id);
      });
  };

  const editUser = (e: any) => {
    e.preventDefault();
    fetch(`/api/userProfile/updateUser/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name: userName, email, userInfo: { bio: bio } }),
      headers: {
        Authorization: localStorage.jwtToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        addToast("User updated", {
          appearance: "success",
          autoDismiss: true
        });
      });
  };

  const fetchStalks = () => {
    fetch(`/api/stalks/stalkers/${user.id}/amount`, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setStalkers(data.stalkers);
      });
    fetch(`/api/stalks/stalking/${user.id}/amount`, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setStalking(data.stalking);
      });
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
              userImage: { image: userImage.image },
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
        <Button onClick={() => setImageForm(!imageForm)}>
          Upload new profile Image
        </Button>
        <br />
        {imageForm && (
          <PicCropUpload
            setCroppedImage={setCroppedImage}
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
  errors: state.errors
});
export default connect(mapStateToProps)(MyProfile);
