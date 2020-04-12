import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { requestGet } from "utils/request";
import { formatDate, formatHour } from "utils/date";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import UserPosts from "./UserPosts";

interface Props {
  auth: any;
  errors: any;
  match: any;
}

function Profile({ auth, errors, match }: Props) {
  const [publicUser, setUser]: any = useState();
  const { user } = auth;
  const [username, setUsername] = useState(match.params.username);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    new Promise((resolve, reject) => {
      requestGet("/api/userProfile/user/" + username, resolve);
    }).then((user: any) => {
      setUser(user);
      requestGet("/api/posts/from/" + user[0]._id, setPosts);
    });
  };

  return (
    <Container id="profile" fluid style={{ paddingTop: "4rem" }}>
      <Col md={{ span: 6, offset: 3 }}>
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
        <UserPosts posts={posts} fetchPosts={fetchUser}/>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Profile);
