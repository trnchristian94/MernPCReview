import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import stalkRequestReducer from "./stalkRequestReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  stalks: stalkRequestReducer
});
