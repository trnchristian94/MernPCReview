import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { formatDate, formatHour } from "utils/date";
import { Link } from "react-router-dom";
import { requestDelete, requestPut } from "utils/request";

import Delete from "@material-ui/icons/Delete";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import Favorite from "@material-ui/icons/Favorite";

import Avatar from "@material-ui/core/Avatar";
import { useToasts } from "react-toast-notifications";

import { likePost, removeLikePost } from "userLogic/actions/postActions";

import {
  userLikePost,
  userRemoveLikePost
} from "userLogic/actions/userPostActions";

interface IProps {
  auth: any;
  posts: any;
  fetchPosts: any;
  likePost: any;
  removeLikePost: any;
  userLikePost: any;
  userRemoveLikePost: any;
}

function UserPosts({
  auth,
  posts,
  fetchPosts,
  likePost,
  removeLikePost,
  userLikePost,
  userRemoveLikePost
}: IProps) {
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

  const likePost_ = (postId: string) => {
    let direction =
      location.pathname.substr(location.pathname.length - 1) === "/"
        ? `/user/${user.name}/`
        : `/user/${user.name}`;
    if (location.pathname === direction) {
      userLikePost(postId);
    } else {
      likePost(postId);
      if (location.pathname.substr(1, 4) == "user") {
        fetchPosts();
      }
    }
  };

  const removeLikePost_ = (postId: string) => {
    let direction =
      location.pathname.substr(location.pathname.length - 1) === "/"
        ? `/user/${user.name}/`
        : `/user/${user.name}`;
    if (location.pathname === direction) {
      userRemoveLikePost(postId);
    } else {
      removeLikePost(postId);
      if (location.pathname.substr(1, 4) == "user") {
        fetchPosts();
      }
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
              {post.likes &&
              post.likes.length > 0 &&
              post.likes.includes(user.id) ? (
                <div className="liked vAlign">
                  <Favorite
                    className="likedButton rounded"
                    onClick={() => removeLikePost_(post._id)}
                  />
                  {` ${post.likes.length}`}
                </div>
              ) : (
                <div className="like vAlign">
                  <FavoriteBorderOutlined
                    className="likeButton rounded"
                    onClick={() => likePost_(post._id)}
                  />
                  {` ${post.likes.length}`}
                </div>
              )}
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
export default connect(mapStateToProps, {
  likePost,
  removeLikePost,
  userLikePost,
  userRemoveLikePost
})(UserPosts);
