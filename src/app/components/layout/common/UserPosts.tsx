import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { formatDate, formatHour } from "utils/date";
import { requestDelete, requestPut } from "utils/request";

import Delete from "@material-ui/icons/Delete";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Favorite from "@material-ui/icons/Favorite";
import Avatar from "@material-ui/core/Avatar";

import { useToasts } from "react-toast-notifications";

import Post from "layout/common/Post";

import { likePost, removeLikePost } from "userLogic/actions/postActions";

import {
  userLikePost,
  userRemoveLikePost
} from "userLogic/actions/userPostActions";

import "./UserPosts.scss";
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
  const [floatingImg, setFloatingImg] = useState(false);
  const [clickedImg, setClickedImg] = useState("");
  const [answeredPost, setAnsweredPost] = useState("");
  const [showSubmitPost, setShowSubmitPost] = useState(false);

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

  const setFullScreen = (big: boolean, imgId: string) => {
    setClickedImg(imgId);
    setFloatingImg(big);
  };

  const submitNewPost = (postId: string) => {
    setShowSubmitPost(true);
    setAnsweredPost(postId);
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
                <span className="postDate">{`${formatDate(
                  post.date
                )} ${formatHour(post.date)}`}</span>
              </div>
              {/* Answer of a post */}
              {post.answeredPost && (
                <div className="answeredPost">
                  <div className="answeredPost__header">
                    {post.answeredPost.creator.userImage && (
                      <div className="answeredPost__image">
                        <Avatar
                          src={post.answeredPost.creator.userImage.image}
                        ></Avatar>
                      </div>
                    )}
                    <div className="answeredPost__creatorName">
                      @{post.answeredPost.creator.name}
                    </div>
                  </div>
                  <div className="answeredPost__text">
                    {post.answeredPost.text}
                  </div>
                </div>
              )}
              {/* Content of the post */}
              <div className="postText">{post.text}</div>
              {post.postImage && (
                <div className="postImg">
                  <img
                    className="postImg__img"
                    onClick={() => setFullScreen(!floatingImg, post._id)}
                    src={post.postImage.image}
                    title={`${post.creator.name} post image`}
                  />
                </div>
              )}
              {floatingImg && clickedImg == post._id && (
                <div
                  className="floatingImg"
                  onClick={() => {
                    setFullScreen(false, post._id);
                  }}
                >
                  <img
                    className="postImg__img"
                    src={post.postImage.image}
                    title={`${post.creator.name} post image bigger`}
                  />
                </div>
              )}
              {/* User actions of the post */}
              <div className="userPostActions">
                {post.likes &&
                post.likes.length > 0 &&
                post.likes.includes(user.id) ? (
                  <div className="liked">
                    <Favorite
                      className="likedButton rounded"
                      onClick={() => removeLikePost_(post._id)}
                    />
                    {` ${post.likes.length}`}
                  </div>
                ) : (
                  <div className="like">
                    <FavoriteBorderOutlined
                      className="likeButton rounded"
                      onClick={() => likePost_(post._id)}
                    />
                    {` ${post.likes.length}`}
                  </div>
                )}
                <div className="comment">
                  <ChatBubbleOutlineIcon
                    onClick={() => submitNewPost(post._id)}
                  />
                  {post.answers.length}
                </div>

                {post.creator._id === user.id && (
                  <Delete
                    className="delete"
                    onClick={() => removePost(post._id)}
                  />
                )}
              </div>
            </div>
          );
        })}
      {showSubmitPost && (
        <Post setShowSubmitPost={setShowSubmitPost} answer={answeredPost} />
      )}
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
