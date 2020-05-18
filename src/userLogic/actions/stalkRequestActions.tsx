import { GET_STALKERS } from "./types";
// Register User
export const getStalkRequests = (user: { id: String }) => (dispatch: any) => {
  if (localStorage.jwtToken) {
    fetch(`/api/stalks/received/${user.id}/amount`, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: GET_STALKERS,
          payload: data
        });
      })
      .catch((err) => console.log(err));
  }
};
