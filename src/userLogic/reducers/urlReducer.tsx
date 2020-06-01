import { SET_URL } from "userLogic/actions/types";

const initialState = {};
export default function (state: any = initialState, action: any) {
  switch (action.type) {
    case SET_URL:
      return {
        ...state,
        url: action.payload
      };
    default:
      return state;
  }
}
