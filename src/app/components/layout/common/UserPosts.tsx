import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { formatDate, formatHour, getTimeUntilNow } from "utils/date";
import req from "utils/request";
import { getUrlDir } from "utils/string";

import Delete from "@material-ui/icons/Delete";
import FavoriteBorderOutlined from "@material-ui/icons/FavoriteBorderOutlined";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Favorite from "@material-ui/icons/Favorite";
import Cached from "@material-ui/icons/Cached";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

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
  const [postss, setPosts] = useState(posts);
  //const direction = getUrlDir(1);

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
      req.del(`/api/posts/${user.id}`, callback, { postId });
    }
  };

  

  const likePost_ = (postId: string, hasRepost: boolean) => {
    let direction =
      location.pathname.substr(location.pathname.length - 1) === "/"
        ? `/user/${user.name}/`
        : `/user/${user.name}`;
    if (location.pathname === direction) {
      userLikePost(postId);
    } else {
      likePost(postId);
      if (location.pathname.substr(1, 4) == "user" || hasRepost) {
        fetchPosts();
      }
    }
  };

  const removeLikePost_ = (postId: string, hasRepost: boolean) => {
    let direction =
      location.pathname.substr(location.pathname.length - 1) === "/"
        ? `/user/${user.name}/`
        : `/user/${user.name}`;
    if (location.pathname === direction) {
      userRemoveLikePost(postId);
    } else {
      removeLikePost(postId);
      if (location.pathname.substr(1, 4) == "user" || hasRepost) {
        fetchPosts();
      }
    }
  };

  const repost = (postId: string) => {
    const callback = () => {
      fetchPosts();
    };
    req.post(`/api/repost/${user.id}`, { postId }, callback);
  };
  const removeRepost = (postId: string) => {
    if (confirm("Remove repost ?")) {
      const callback = () => {
        showToast("Repost deleted");
        fetchPosts();
      };
      req.del(`/api/repost/${user.id}`, callback, { postId });
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

  const renderDate = (d: Date, key: any) => {
    let ret = [];
    ret.push(
      <Tooltip key={key} title={`${formatDate(d)} ${formatHour(d)}`}>
        <span className="postDate">{getTimeUntilNow(d)}</span>
      </Tooltip>
    );
    return ret;
  };

  return (
    <div id="userPosts">
      {posts &&
        posts.length > 0 &&
        posts.map((p: any, key: any) => {
          let post = p;
          // Checks if it's a repost and adds its values to the post
          if (p.post) {
            post = p.post;
            post.repostDate = p.date;
            post.reposter = p.reposter;
          }
          return (
            <div className="userPost" key={key}>
              {/* Reposter info */}
              {post.reposter && (
                <div className="repostHeader">
                  <Avatar
                    alt={`${post.creator.name} reposter image`}
                    className="avatarImg"
                    src={post.reposter.userImage.image}
                  />
                  <Cached className="repostedButton" />
                  <span>Repost from </span>
                  <span>
                    <Link
                      to={`/user/${post.reposter.name}`}
                    >{`@${post.reposter.name}`}</Link>
                  </span>
                  {renderDate(post.repostDate, key)}
                </div>
              )}
              {/* Post info */}
              <div className={post.reposter ? "repostBody" : "postBody"}>
                <div className="postHeader">
                  <div className="user">
                    <Avatar
                      alt={`${post.creator.name} profile image`}
                      className="avatarImg"
                      src={post.creator.userImage.image}
                    />
                    <div className="postUserName">
                      <span>
                        <Link
                          to={`/user/${post.creator.name}`}
                        >{`@${post.creator.name}`}</Link>
                      </span>
                    </div>
                  </div>
                  {renderDate(post.date, key)}
                </div>
                {/* Answer of a post */}
                {post.answeredPost && (
                  <div className="answeredPost">
                    <div className="answeredPostHeader">
                      {post.answeredPost.creator.userImage && (
                        <div className="answeredPost__image">
                          <Avatar
                            src={post.answeredPost.creator.userImage.image}
                          ></Avatar>
                        </div>
                      )}
                      <div className="answeredPost__creatorName">
                      <span>
                        <Link
                          to={`/user/${post.answeredPost.creator.name}`}
                        >{`@${post.answeredPost.creator.name}`}</Link>
                      </span>
                        
                      </div>
                      {renderDate(post.answeredPost.date, key)}
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
                  {/* Likes */}
                  {post.likes &&
                  post.likes.length > 0 &&
                  post.likes.includes(user.id) ? (
                    <div className="liked">
                      <Favorite
                        className="likedButton rounded"
                        onClick={() => removeLikePost_(post._id, post.reposter||post.reposts.length>0?true:false)}
                      />
                      {` ${post.likes.length}`}
                    </div>
                  ) : (
                    <div className="like">
                      <FavoriteBorderOutlined
                        className="likeButton rounded"
                        onClick={() => likePost_(post._id, post.reposter||post.reposts.length>0?true:false)}
                      />
                      {` ${post.likes.length}`}
                    </div>
                  )}
                  {/* Repost */}
                  <div className={post.reposter ? "reposted" : "repost"}>
                    <Cached
                      className={
                        post.reposts && post.reposts.includes(user.id)
                          ? "repostedButton"
                          : "repostButton"
                      }
                      onClick={() =>
                        post.reposts && post.reposts.includes(user.id)
                          ? removeRepost(post._id)
                          : repost(post._id)
                      }
                    />
                    {post.reposts.length}
                  </div>
                  {/* Comment */}
                  <div className="comment">
                    <ChatBubbleOutlineIcon
                      onClick={() => submitNewPost(post._id)}
                    />
                    {post.answers? post.answers.length: 0}
                  </div>
                  {/* Delete */}
                  {post.creator._id === user.id && (
                    <Delete
                      className="delete"
                      onClick={() => removePost(post._id)}
                    />
                  )}
                </div>
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
