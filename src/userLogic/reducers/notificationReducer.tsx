import { GET_NEW_NOTIFICATIONS } from "userLogic/actions/types";
const initialState = {};
export default function(state = initialState, action: any) {
  switch (action.type) {
    case GET_NEW_NOTIFICATIONS:
      return {
        ...state,
        newNotifications: action.payload
      };
    default:
      return state;
  }
}
