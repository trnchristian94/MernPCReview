import { GET_USER_POSTS } from "userLogic/actions/types";

const initialState = {};
export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload
      };
    default:
      return state;
  }
}
