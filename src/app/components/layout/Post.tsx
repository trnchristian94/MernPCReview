import React, { useEffect, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { requestGet, requestPost } from "utils/request";
import { useToasts } from "react-toast-notifications";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  setShowSubmitPost: any;
}

function Post({ auth, errors, setShowSubmitPost }: Props) {
  const { addToast } = useToasts();
  const { user } = auth;
  const [postText, setPostText] = useState("");

  const showToast = (message: string) => {
    addToast(message, {
      appearance: "success",
      autoDismiss: true
    });
  };

  const submitPost = (e: any) => {
    const callback = () => {
      showToast("Posted");
      setPostText("");
    };
    requestPost(`/api/posts/${user.id}`, { text: postText }, callback);
    setShowSubmitPost(false);
    e.preventDefault();
  };

  return (
    <Form
      encType="multipart/form-data"
      onSubmit={submitPost}
      className="floatingSubmitPost"
    >
      <div className="floatingSubmitPostDialog">
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
              required
            />
          </Form.Group>
        </Form.Row>
        <Button type="submit" className="submit-btn" style={{marginRight: "10px"}}>
          Submit
        </Button>
        <Button
          className="cancel-btn"
          variant="secondary"
          onClick={() => setShowSubmitPost(false)}
          style={{marginLeft: "10px"}}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Post);
