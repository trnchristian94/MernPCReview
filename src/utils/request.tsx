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

const requestPut = (url: string, body: any, _callback: any): any => {
  fetch(url, {
    method: "PUT",
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

export { requestGet, requestPut, requestPost, requestDelete, requestPostFile };
