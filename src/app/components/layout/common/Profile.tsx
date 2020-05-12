import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { requestGet } from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import UserPosts from "./UserPosts";
import { getUserPosts } from "userLogic/actions/userPostActions";

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
  const [stalkers, setStalkers] = useState({ stalkers: 0 });
  const [stalking, setStalking] = useState({ stalking: 0 });

  const fetchStalks = (u: any) => {
    requestGet(`/api/stalks/stalkers/${u[0]._id}/amount`, setStalkers);
    requestGet(`/api/stalks/stalking/${u[0]._id}/amount`, setStalking);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUser();
    }
  }, []);

  const fetchUser = () => {
    new Promise((resolve, reject) => {
      requestGet("/api/userProfile/user/" + username, resolve);
    }).then((u: any) => {
      setUser(u);
      fetchStalks(u);
      if (user.name === username) {
        getUserPosts(user);
      } else {
        requestGet("/api/posts/from/" + u[0]._id, setPosts);
      }
    });
  };

  return (
    <Container id="profile" fluid style={{ paddingTop: "4rem" }}>
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
              >{`Stalking: ${stalking.stalking}`}</Link>
            </div>
          </Col>
          <Col xs={6}>
            <div className="stalkers">
              <Link
                to={`/user/${username}/stalkers`}
              >{`Stalkers: ${stalkers.stalkers}`}</Link>
            </div>
          </Col>
        </Row>

        <div className="userBio">
          {publicUser && publicUser[0].userInfo.bio}
        </div>
        <UserPosts
          posts={user.name === username ? userPosts.userPosts : posts}
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
