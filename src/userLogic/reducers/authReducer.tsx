import {
  SET_CURRENT_USER,
  USER_LOADING,
  SET_CURRENT_PROFILE_IMG
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: { userImage: "" },
  loading: false
};
export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENT_PROFILE_IMG:
      if (state.user) {
        let userState = state.user;
        userState.userImage = action.payload;
        return {
          ...state,
          user: userState
        };
      }
    default:
      return state;
  }
}
