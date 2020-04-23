import { GET_POSTS } from "userLogic/actions/types";
import { LIKE_POST } from "userLogic/actions/types";
import { REMOVE_LIKE_POST } from "userLogic/actions/types";

const initialState = {};
export default function (state: any = initialState, action: any) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload
      };
    case LIKE_POST:
      if (state.posts) {
        return {
          ...state,
          posts: state.posts.map((post: any) =>
            post._id == action.payload._id
              ? { ...post, ...action.payload }
              : post
          )
        };
      } else {
        return { ...state };
      }
    case REMOVE_LIKE_POST:
      if (state.posts) {
        return {
          ...state,
          posts: state.posts.map((post: any) =>
            post._id == action.payload._id
              ? { ...post, ...action.payload }
              : post
          )
        };
      } else {
        return { ...state };
      }
    default:
      return state;
  }
}
