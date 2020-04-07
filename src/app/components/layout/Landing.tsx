import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { requestGet, requestPostFile, requestDelete } from "utils/request";

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
    requestGet("/api/images", setImages);
  };
  const addImage = (imageData: any) => {
    const callback = () => {
      addToast("Image uploaded", {
        appearance: "success",
        autoDismiss: true
      });
      getAllImages();
    };
    requestPostFile("/api/images/", imageData, callback);
  };

  const deleteImage = (pic: any) => {
    const callback = () => {
      addToast("Image deleted", {
        appearance: "success",
        autoDismiss: true
      });
      getAllImages();
    };
    if (confirm("Are you sure you want to delete this?")) {
      requestDelete(`/api/images/${pic._id}`, callback, {
        imageId: pic.imageId
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