import { GET_USER_POSTS } from "userLogic/actions/types";
import { USER_LIKE_POST } from "userLogic/actions/types";
import { USER_REMOVE_LIKE_POST } from "userLogic/actions/types";

const initialState = {};
export default function (state: any = initialState, action: any) {
  switch (action.type) {
    case GET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload
      };
    case USER_LIKE_POST:
      if (state.userPosts) {
        return {
          ...state,
          userPosts: state.userPosts.map((post: any) =>
            post._id == action.payload._id
              ? { ...post, ...action.payload }
              : post
          )
        };
      } else {
        return { ...state };
      }
    case USER_REMOVE_LIKE_POST:
      if (state.userPosts) {
        return {
          ...state,
          userPosts: state.userPosts.map((post: any) =>
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
