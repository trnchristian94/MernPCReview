import { SET_LOADING } from "userLogic/actions/types";

const initialState = {};
export default function (state: any = initialState, action: any) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loadingStatus: action.payload
      };
    default:
      return state;
  }
}
