import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { getPosts } from "userLogic/actions/postActions";

import { connect } from "react-redux";
import UserPosts from "common/UserPosts";
interface Props {
  auth: any;
  errors: any;
  posts: any;
  getPosts: any;
}
function Home({ auth, errors, posts, getPosts }: Props) {
  const { user } = auth;

  useEffect(() => {
    if (user.id) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = () => {
    getPosts(user);
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }} className="pr-0 pl-0">
      <div>
        <h2 className='ml-5'>The PC Review</h2>
        {posts && <UserPosts posts={posts} fetchPosts={fetchPosts} />}
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
  posts: state.posts.posts
});
export default connect(mapStateToProps, { getPosts })(Home);
