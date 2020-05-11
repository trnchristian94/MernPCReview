import { GET_NEW_NOTIFICATIONS } from "./types";
// Register User
export const getNewNotifications = (user: { id: String }) => (dispatch: any) => {
  if(localStorage.jwtToken){
    fetch(`/api/notifications/${user.id}/amount`, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: GET_NEW_NOTIFICATIONS,
          payload: data.newNotifications
        });
      })
      .catch(err => console.log(err));
  }
  
};
