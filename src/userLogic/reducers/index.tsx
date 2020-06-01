import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import stalkRequestReducer from "./stalkRequestReducer";
import postReducer from "./postReducer";
import userPostReducer from "./userPostReducer";
import loadingReducer from "./loadingReducer";
import notificationReducer from "./notificationReducer";
import urlReducer from "./urlReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  stalks: stalkRequestReducer,
  posts: postReducer,
  userPosts: userPostReducer,
  loadingStatus: loadingReducer,
  newNotifications: notificationReducer,
  url: urlReducer
});
