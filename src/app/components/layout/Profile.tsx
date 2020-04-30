import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { requestGet } from "utils/request";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import UserPosts from "./UserPosts";
import { getUserPosts } from "userLogic/actions/userPostActions";

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
                className="landscapeImg"
                src={publicUser[0].userImage.landscape}
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
