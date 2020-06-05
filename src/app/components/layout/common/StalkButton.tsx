import React, { useState } from "react";
import { connect } from "react-redux";

import { useToasts } from "react-toast-notifications";

import req from "utils/request";
import { getStalkRequests } from "userLogic/actions/stalkRequestActions";

import Button from "react-bootstrap/Button";

import "./StalkButton.scss";

interface IProps {
  auth: any;
  getStalkRequests: any;
  userId: string;
  fetchUsers?: any;
  status?: number;
  stalker?: any;
}

function StalkButton({
  auth,
  getStalkRequests,
  userId,
  status,
  fetchUsers,
  stalker,
}: IProps) {
  const { addToast } = useToasts();
  const [statusText, setStatusText] = useState("");
  const { user } = auth;

  const addUser = (userId: string) => {
    const callback = () => {
      fetchUsers();
    };
    req.post(`/api/stalks`, { recipient: userId }, callback);
  };

  const cancelRequest = () => {
    const callback = () => {
      addToast("Stalk removed", {
        appearance: "success",
        autoDismiss: true
      });
      fetchUsers();
    };
    req.del(`/api/stalks/cancel`, callback, {
      recipient: userId
    });
  };

  const actionRequest = (action: string) => {
    let message = "";
    if (action === "accept") {
      message = "Stalk request accepted";
    } else if (action === "deny") {
      message = "Stalk request dennied";
    }
    const callback = () => {
      addToast(message, {
        appearance: "success",
        autoDismiss: true
      });
      fetchUsers();
      getStalkRequests(auth.user);
    };
    req.put(`/api/stalks/${action}`, { requester: userId }, callback);
  };

  const renderStatus = () => {
    if(user.id === userId) return <div></div>
    switch (status) {
      case 0:
        return (
          <Button
            variant="outline-primary"
            className="stalkReqButton"
            onClick={() => addUser(userId)}
          >
            Stalk
          </Button>
        );
      case 1:
        if (stalker) {
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="success"
                className="stalkReqButton"
                style={{ marginRight: "5px" }}
                onClick={() => actionRequest("accept")}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                className="stalkReqButton"
                onClick={() => actionRequest("deny")}
              >
                Cancel
              </Button>
            </div>
          );
        } else {
          return (
            <Button
              variant="outline-primary"
              className="stalkReqButton"
              onMouseEnter={() => setStatusText("Cancel")}
              onMouseLeave={() => setStatusText("Pending...")}
              onClick={() => cancelRequest()}
            >
              {statusText ? statusText : "Pending..."}
            </Button>
          );
        }
      case 2:
        return (
          <Button
            variant="primary"
            className="stalkingButton"
            onMouseEnter={() => setStatusText("Stop stalking")}
            onMouseLeave={() => setStatusText("Stalking")}
            onClick={() => cancelRequest()}
          >
            {statusText ? statusText : "Stalking"}
          </Button>
        );
      case 3:
        return (
          <Button
            variant="info"
            className="stalkCanceledButton"
            onMouseEnter={() => setStatusText("Ok :(")}
            onMouseLeave={() => setStatusText("Stalk denied")}
            onClick={() => cancelRequest()}
          >
            {statusText ? statusText : "Stalk denied"}
          </Button>
        );
    }
  };

return (<div className="stalkButton">{renderStatus()}</div>);
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  stalkers: state.stalkers
});
export default connect(mapStateToProps, { getStalkRequests })(StalkButton);
