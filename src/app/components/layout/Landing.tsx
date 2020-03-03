import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
}
function Landing({ auth, errors }: Props) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const { addToast } = useToasts();

  const onSubmit = (e: any) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    addImage(formData);
    setTitle("");
    setImage("");
  };

  const getAllImages = () => {
    fetch("/api/images") // Por defecto es GET
      .then(res => res.json())
      .then(data => {
        setImages(data);
      });
  };
  const addImage = (imageData: any) => {
    fetch("/api/images/", {
      method: "POST",
      body: imageData
    })
      .then(res => res.json())
      .then(data => {
        addToast(data.status, {
          appearance: "success",
          autoDismiss: true
        });
        getAllImages();
      })
      .catch(err =>
        addToast(err.message, {
          appearance: "error",
          autoDismiss: true
        })
      );
  };
  const deleteImage = (pic: any) => {
    if (confirm("Are you sure you want to delete this?")) {
      fetch(`/api/images/${pic._id}`, {
        method: "DELETE",
        body: JSON.stringify({ imageId: pic.imageId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          addToast(data.status, {
            appearance: "success",
            autoDismiss: true
          });
          getAllImages();
        });
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <Container>
      <div>
        <h2>This is the image website now :D</h2>
        <Form encType="multipart/form-data" onSubmit={onSubmit}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Image Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Task title"
                style={{ width: "100px" }}
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>
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
      </div>
      <div>
        <Col>
          <Row>
            {images.map(im => {
              return (
                <Card
                  key={im._id}
                  id={im.imageId}
                  style={{ width: "12rem", margin: "5px" }}
                >
                  <Card.Img
                    variant="top"
                    src={im.image}
                    className="main-image"
                    alt="This is a terrible description!"
                    style={{ padding: "5px", maxHeight: "10rem" }}
                  />
                  <Card.Title>{im.title}</Card.Title>
                  <Button onClick={() => deleteImage(im)}>Delete</Button>
                </Card>
              );
            })}
          </Row>
        </Col>
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Landing);
