import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import stalkRequestReducer from "./stalkRequestReducer";
import postReducer from "./postReducer";
import userPostReducer from "./userPostReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  stalks: stalkRequestReducer,
  posts: postReducer,
  userPosts: userPostReducer
});
