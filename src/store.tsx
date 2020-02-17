import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "userLogic/reducers";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}
const initialState = {};
const middleware = [thunk];
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
