import { GET_STALKERS } from "userLogic/actions/types";
const initialState = {};
export default function(state = initialState, action: any) {
  switch (action.type) {
    case GET_STALKERS:
      return {
        ...state,
        stalkRequests: action.payload
      };
    default:
      return state;
  }
}
