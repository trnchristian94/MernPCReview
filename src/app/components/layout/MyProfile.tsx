import React, { useEffect, useState } from "react";
import { Container, Form, Col, Card, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

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
  const [imageForm, setImageForm] = useState(false);
  const [id, setId] = useState("");

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
        console.log(data.userImage);
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

  const uploadImage = (e: any) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("image", image);
    formData.append("userId", id);
    addImage(formData);
  };
  const addImage = (imageData: any) => {
    fetch("/api/userProfile/uploadImage/", {
      headers: {
        Authorization: localStorage.jwtToken
      },
      method: "POST",
      body: imageData
    })
      .then(res => res.json())
      .then(data => {
        addToast(data.status, {
          appearance: "success",
          autoDismiss: true
        });
        fetchUser();
      })
      .catch(err =>
        addToast(err.message, {
          appearance: "error",
          autoDismiss: true
        })
      );
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUser();
    }
  }, []);

  return (
    <Container style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ margin: "15px 0px 0px 15px", width: "200px" }}>
            <Card.Body style={{ textAlign: "center" }}>
              {userImage && (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    display: "block",
                    margin: "auto"
                  }}
                >
                  <Card.Img
                    variant="top"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      borderRadius: "50%"
                    }}
                    src={userImage.image}
                  />
                </div>
              )}
              <Card.Title>@{userName}</Card.Title>
              <Card.Text style={{ color: "#53adda" }}>{bio}</Card.Text>
            </Card.Body>
          </Card>
        </div>
        <br />
        <Button onClick={() => setImageForm(!imageForm)}>
          Upload new profile Image
        </Button>
        <br />
        {imageForm && (
          <Form encType="multipart/form-data" onSubmit={uploadImage}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Choose an image </Form.Label>
                <br />
                <input
                  type="file"
                  className="form-input"
                  onChange={(e: any) => setImage(e.target.files[0])}
                />
              </Form.Group>
            </Form.Row>
            <Button type="submit" className="submit-btn">
              Submit!
            </Button>
          </Form>
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
