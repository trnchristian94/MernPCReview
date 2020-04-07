import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserCard from "components/layout/UserCard";
import { connect } from "react-redux";
import { requestGet } from "utils/request";
import { withRouter } from "react-router-dom";
import { formatDate, formatHour } from "utils/date";

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
        <div className="userPosts">
          {posts &&
            posts.map((post) => {
              return (
                <div className="userPost" key={post._id}>
                  <div className="postDate">{`${formatDate(
                    post.date
                  )} ${formatHour(post.date)}`}</div>
                  <div className="postText">{post.text}</div>
                </div>
              );
            })}
        </div>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Profile);
