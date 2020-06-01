import { AppearanceTypes } from "react-toast-notifications";

import { setLoadingStatus } from "userLogic/actions/loadingActions";
import store from "src/store";

const showAlert = (
  responseStatus: any,
  message: string,
  addToast: any
): any => {
  let status: AppearanceTypes = "success";
  if (responseStatus != 200) {
    status = "warning";
  }
  addToast(message, {
    appearance: status,
    autoDismiss: true
  });
};
const get = (url: string, _setValue: any): any => {
  const oldLoc = location.pathname;
  store.dispatch(setLoadingStatus(2));
  fetch(url, {
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null
    }
  })
    .then((res) => res.json())
    .then((data) => {
      store.dispatch(setLoadingStatus(1));
      if (oldLoc === location.pathname || `${oldLoc}/` === location.pathname) {
        _setValue(data);
      }
    });
};

const put = (
  url: string,
  body?: any,
  _callback?: any,
  addToast?: any
): any => {
  store.dispatch(setLoadingStatus(2));
  fetch(url, {
    method: "PUT",
    body: body ? JSON.stringify(body) : "",
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then((res) =>
    res.json().then((data) => {
      store.dispatch(setLoadingStatus(1));
      if (res.status && addToast) showAlert(res.status, data.status, addToast);
      if (_callback) _callback();
    })
  );
};

const post = (url: string, body: any, _callback: any): any => {
  store.dispatch(setLoadingStatus(2));
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((data) => {
      store.dispatch(setLoadingStatus(1));
      _callback();
    })
    .catch((err) => console.log(err));
};

const postFile = (
  url: string,
  body: any,
  _callback: any,
  addToast?: any
): any => {
  store.dispatch(setLoadingStatus(2));
  fetch(url, {
    method: "POST",
    body: body,
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null
    }
  }).then((res) =>
    res
      .json()
      .then((data) => {
        store.dispatch(setLoadingStatus(1));
        if (res.status && addToast)
          showAlert(res.status, data.status, addToast);
        _callback();
      })
      .catch((err) => console.log(err))
  );
};

const del = (
  url: string,
  _callback: any,
  body?: any,
  addToast?: any
): any => {
  store.dispatch(setLoadingStatus(2));
  fetch(url, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : "",
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then((res) =>
      res.json().then((data) => {
        store.dispatch(setLoadingStatus(1));
        if (res.status && addToast)
          showAlert(res.status, data.status, addToast);
        _callback();
      })
    )
    .catch((err) => console.log(err));
};


export default { get, put, post, del, postFile };
