import { GET_POSTS } from "./types";
import { GET_USER_POSTS } from "./types";

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
