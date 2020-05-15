import React, { useEffect, useState } from "react";
import { requestPostFile } from "utils/request";
import { useToasts } from "react-toast-notifications";
import CloseRounded from "@material-ui/icons/CloseRounded";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import { getPosts } from "userLogic/actions/postActions";
import { getUserPosts } from "userLogic/actions/userPostActions";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { connect } from "react-redux";

import "./Post.scss";

interface Props {
  auth: any;
  errors: any;
  setShowSubmitPost: any;
  getPosts: any;
  getUserPosts: any;
  answer?: string;
}

function Post({
  auth,
  errors,
  setShowSubmitPost,
  getPosts,
  getUserPosts,
  answer
}: Props) {
  const { addToast } = useToasts();
  const { user } = auth;
  const [postText, setPostText] = useState("");
  const [image, setImage]: any = useState();
  let textInput: any = null;
  let inputImage: any;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.keyCode === 27) setShowSubmitPost(false);
    };
    document.addEventListener("keydown", listener, false);
    textInput.select();
  }, []);

  const showToast = (message: string) => {
    addToast(message, {
      appearance: "success",
      autoDismiss: true
    });
  };

  const submitPost = (e: any) => {
    e.preventDefault();
    const callback = () => {
      showToast("Posted");
      let direction =
        location.pathname.substr(location.pathname.length - 1) === "/"
          ? `/user/${user.name}/`
          : `/user/${user.name}`;
      if (location.pathname === direction) {
        getUserPosts(user);
      } else {
        getPosts(user);
      }
    };
    let formData = new FormData();
    formData.append("text", postText);
    if (image) {
      if(image.size > 3500000 ){
        alert("Image exceeds max size 3.5MB, please upload another image.");
        return false;
      }
      formData.append("image", image);
    }
    if(answer){
      requestPostFile(`/api/posts/${user.id}/answer/${answer}`, formData, callback);
    } else {
      requestPostFile(`/api/posts/${user.id}`, formData, callback);
    }
    setShowSubmitPost(false);
  };

  return (
    <Form
      encType="multipart/form-data"
      onSubmit={submitPost}
      className="floatingSubmitPost"
    >
      <div className="floatingSubmitPostDialog">
        <CloseRounded
          className="closeDialogIcon"
          onClick={() => setShowSubmitPost(false)}
        />
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Write a text:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              type="text"
              name="post"
              placeholder="Post text"
              style={{ width: "25vw" }}
              value={postText}
              onChange={(e: any) => setPostText(e.target.value)}
              ref={(text: any) => {
                textInput = text;
              }}
              required
            />
          </Form.Group>
        </Form.Row>
        <Button
          className="postImg-btn"
          style={{ marginRight: "10px", borderRadius: "20px" }}
          onClick={() => {
            inputImage.click();
          }}
        >
          <AddAPhoto />
          Image
        </Button>
        <input
          ref={(input) => (inputImage = input)}
          type="file"
          className="form-input"
          style={{ display: "none" }}
          onChange={(e: any) => setImage(e.target.files[0])}
        />
        <Button
          type="submit"
          className="submit-btn"
          style={{ marginRight: "10px", borderRadius: "20px" }}
        >
          Submit
        </Button>
        <Button
          className="cancel-btn"
          variant="secondary"
          onClick={() => setShowSubmitPost(false)}
          style={{ borderRadius: "20px" }}
        >
          Cancel
        </Button>
        <div style={{ height: "15px" }}>
          {image && `${image.name.substr(0, 25)}...`}
        </div>
      </div>
    </Form>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps, { getPosts, getUserPosts })(Post);
