import { SET_LOADING } from "./types";

export const setLoadingStatus = (status: number) => {
  return {
    type: SET_LOADING,
    payload: status
  };
};
