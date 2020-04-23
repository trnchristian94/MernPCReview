import { useToasts, AppearanceTypes } from "react-toast-notifications";

const requestGet = (url: string, _setValue: any): any => {
  fetch(url, {
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null
    }
  })
    .then(res => res.json())
    .then(data => {
      _setValue(data);
    });
};

const requestPut = (url: string, body?: any, _callback?: any): any => {
  fetch(url, {
    method: "PUT",
    body: body?JSON.stringify(body):'',
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(res => {
    res.json().then(data => {
      if (res.status) {
        showAlert(res.status, data.status, _callback);
      } else {
        _callback();
      }
    });
  });
};

const requestPost = (url: string, body: any, _callback: any): any => {
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      _callback();
    })
    .catch(err => console.log(err));
};

const requestPostFile = (url: string, body: any, _callback: any): any => {
  fetch(url, {
    method: "POST",
    body: body,
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null
    }
  })
    .then(res => res.json())
    .then(data => {
      _callback();
    })
    .catch(err => console.log(err));
};

const requestDelete = (url: string, _callback: any, body?: any): any => {
  fetch(url, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : "",
    headers: {
      Authorization: localStorage.jwtToken ? localStorage.jwtToken : null,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      _callback();
    })
    .catch(err => console.log(err));
};

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

export { requestGet, requestPut, requestPost, requestDelete, requestPostFile };
