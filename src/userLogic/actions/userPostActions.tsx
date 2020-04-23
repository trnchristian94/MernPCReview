import { GET_USER_POSTS } from "./types";
import { USER_LIKE_POST } from "./types";
import { USER_REMOVE_LIKE_POST } from "./types";


export const getUserPosts = (user: { id: String }) => (dispatch: any) => {
  fetch(`/api/posts/from/${user.id}`, {
    headers: {
      Authorization: localStorage.jwtToken
    }
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_USER_POSTS,
        payload: data
      });
    })
    .catch((err) => console.log(err));
};

export const userLikePost = (postId: String) => (dispatch: any) => {
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
        type: USER_LIKE_POST,
        payload: data
      });
    });
  });
};

export const userRemoveLikePost = (postId: String) => (dispatch: any) => {
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
        type: USER_REMOVE_LIKE_POST,
        payload: data
      });
    });
  });
};
