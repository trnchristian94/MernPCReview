import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { formatDate, formatHour } from "utils/date";
import { Link } from "react-router-dom";
import { requestDelete } from "utils/request";

import Delete from "@material-ui/icons/Delete";
import Avatar from "@material-ui/core/Avatar";
import { useToasts } from "react-toast-notifications";

interface IProps {
  auth: any;
  posts: any;
  fetchPosts: any;
}

function UserPosts({ auth, posts, fetchPosts }: IProps) {
  const { addToast } = useToasts();
  const { user } = auth;

  const showToast = (message: string) => {
    addToast(message, {
      appearance: "success",
      autoDismiss: true
    });
  };

  const removePost = (postId: string) => {
    if (confirm("Are you sure you want to delete this?")) {
      const callback = () => {
        showToast("Post deleted");
        fetchPosts();
      };
      requestDelete(`/api/posts/${user.id}`, callback, { postId });
    }
  };

  return (
    <div id="userPosts">
      {posts &&
        posts.length > 0 &&
        posts.map((post: any) => {
          return (
            <div className="userPost" key={post._id}>
              <div className="postHeader">
                <div className="user">
                  <Avatar
                    alt={`${post.creator.name} profile image`}
                    className="avatarImg"
                    src={post.creator.userImage.image}
                  />
                  <div className="postUserName">
                    <Link
                      to={`user/${post.creator.name}`}
                      className="nav-link"
                    >{`@${post.creator.name}`}</Link>
                  </div>
                </div>
                <div className="postDate">{`${formatDate(
                  post.date
                )} ${formatHour(post.date)}`}</div>
              </div>
              <div className="postText">{post.text}</div>
              {post.creator._id === user.id && (
                <Delete
                  className="delete"
                  onClick={() => removePost(post._id)}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(UserPosts);
