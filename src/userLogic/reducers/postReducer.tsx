import { GET_POSTS } from "userLogic/actions/types";

const initialState = {};
export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload
      };
    default:
      return state;
  }
}
