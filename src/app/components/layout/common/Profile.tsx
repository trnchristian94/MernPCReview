import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import req from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import UserPosts from "./UserPosts";
import { getUserPosts } from "userLogic/actions/userPostActions";

import { getUrlDir } from "utils/string";

import "./Profile.scss";
import { Link } from "react-router-dom";

interface Props {
  auth: any;
  errors: any;
  match: any;
  userPosts: any;
  getUserPosts: any;
  history: any;
}

function Profile({
  auth,
  errors,
  match,
  userPosts,
  getUserPosts,
  history
}: Props) {
  const [publicUser, setUser]: any = useState();
  const { user } = auth;
  const username = match.params.username;
  const [posts, setPosts] = useState([]);
  const [stalkers, setStalkers] = useState(0);
  const [stalking, setStalking] = useState(0);
  const [likes, setLikes] = useState(0);
  const [postsAmount, setPostsAmount] = useState(0);
  const direction = getUrlDir(1);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUser();
    }
  }, [username]);

  const fetchAmounts = (u: any) => {
    req.get(`/api/stalks/stalkers/${u[0]._id}/amount`, setStalkers);
    req.get(`/api/stalks/stalking/${u[0]._id}/amount`, setStalking);
    req.get(`/api/posts/likes/${u[0]._id}/amount`, setLikes);
    req.get(`/api/posts/from/${u[0]._id}/amount`, setPostsAmount);
  };

  const fetchUser = () => {
    new Promise((resolve, reject) => {
      req.get("/api/userProfile/user/" + username, resolve);
    }).then((u: any) => {
      setUser(u);
      fetchAmounts(u);
      if (direction === "likes") {
        req.get("/api/posts/likes/" + u[0]._id, setPosts);
      } else {
        if (user.name === username) {
          // If it's own user
          getUserPosts(user);
        } else {
          req.get("/api/posts/from/" + u[0]._id, setPosts);
        }
      }
    });
  };

  return (
    <Container
      id="profile"
      className="pl-0 pr-0"
      fluid
      style={{ paddingTop: "4rem" }}
    >
      <div>
        <div className="imageHeader">
          <div className="landscape">
            {publicUser && publicUser[0].userImage && (
              <img
                className={
                  publicUser[0].userImage.landscape
                    ? "landscapeImg"
                    : "landscapeImg no-landscape"
                }
                src={
                  publicUser[0].userImage.landscape
                    ? publicUser[0].userImage.landscape
                    : publicUser[0].userImage.image
                }
              />
            )}
          </div>
          {publicUser && publicUser[0].userImage && (
            <div className="userImage">
              <img className="userImg" src={publicUser[0].userImage.image} />
            </div>
          )}
        </div>
        <div className="userName">{`@${username}`}</div>
        <Row>
          <Col xs={6}>
            <div className="stalking">
              <Link
                to={`/user/${username}/stalking`}
              >{`Stalking: ${stalking}`}</Link>
            </div>
          </Col>
          <Col xs={6}>
            <div className="stalkers">
              <Link
                to={`/user/${username}/stalkers`}
              >{`Stalkers: ${stalkers}`}</Link>
            </div>
          </Col>
        </Row>
        <div className="userBio">
          {publicUser && publicUser[0].userInfo.bio}
        </div>
        <Row className="postsAndLikes" noGutters>
          <Col xs={6}>
            <Link to={`/user/${username}`} className="linkPostsAmount">
              <div className="postsAmount">{`Posts: ${postsAmount}`}</div>
            </Link>
          </Col>
          <Col xs={6}>
            <Link to={`/user/${username}/likes`} className="linkLikes">
              <div className="likes">{`Likes: ${likes}`}</div>
            </Link>
          </Col>
        </Row>

        <UserPosts
          posts={
            user.name === username && direction !== "likes"
              ? userPosts.userPosts
              : posts
          }
          fetchPosts={fetchUser}
        />
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
  userPosts: state.userPosts
});
export default connect(mapStateToProps, { getUserPosts })(Profile);
