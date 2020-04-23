import { GET_POSTS } from "./types";
import { LIKE_POST } from "./types";
import { REMOVE_LIKE_POST } from "./types";

export const getPosts = (user: { id: String }) => (dispatch: any) => {
  fetch(`/api/posts/fromStalkings/${user.id}`, {
    headers: {
      Authorization: localStorage.jwtToken
    }
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_POSTS,
        payload: data
      });
    })
    .catch((err) => console.log(err));
};

export const likePost = (postId: String) => (dispatch: any) => {
  fetch(`/api/posts/like/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.jwtToken,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then((res) => {
    res.json().then((data) => {
      dispatch({
        type: LIKE_POST,
        payload: data
      });
    });
  });
};

export const removeLikePost = (postId: String) => (dispatch: any) => {
  fetch(`/api/posts/removeLike/${postId}`, {
    method: "PUT",
    headers: {
      Authorization: localStorage.jwtToken,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then((res) => {
    res.json().then((data) => {
      dispatch({
        type: REMOVE_LIKE_POST,
        payload: data
      });
    });
  });
};
