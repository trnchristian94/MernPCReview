import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { requestGet, requestPostFile, requestDelete } from "utils/request";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import { connect } from "react-redux";
import UserPosts from "./UserPosts";

interface Props {
  auth: any;
  errors: any;
}
function Landing({ auth, errors }: Props) {
  const [posts, setPosts] = useState([]);
  const { user } = auth;

  useEffect(() => {
    if (user.id) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = () => {
    requestGet(`/api/posts/fromStalkings/${user.id}`, setPosts);
  };

  return (
    <Container fluid style={{ maxWidth: "75%", paddingTop: "4rem" }}>
      <div>
        <h2>The PC Review</h2>
        {posts && <UserPosts posts={posts} fetchPosts={fetchPosts}/>}
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Landing);
