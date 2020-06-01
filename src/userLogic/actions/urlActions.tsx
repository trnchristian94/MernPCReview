import { SET_URL } from "./types";

export const setUrl = (url: string) => {
  return {
    type: SET_URL,
    payload: url
  };
};
