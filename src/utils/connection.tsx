import { setUrl } from "userLogic/actions/urlActions";
import store from "src/store";
export const checkLogin = (
  auth: { isAuthenticated: boolean },
  history: any
) => {
  if (!auth.isAuthenticated) {
    store.dispatch(setUrl(location.pathname));
    history.push("/login");
    return false;
  }
  return true;
};
