import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { connect, useDispatch } from "react-redux";
import { requestPost, requestDelete, requestPut } from "utils/request";
import { getStalkRequests } from "userLogic/actions/stalkRequestActions";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

interface IProps {
  auth: any;
  user: {
    _id?: string;
    name: string;
    userImage?: { image: string; landscape: string };
    userInfo?: { bio: string };
  };
  showAddButton: boolean;
  status?: number;
  fetchUsers?: any;
  stalker?: boolean;
  getStalkRequests: any;
}

function UserCard({
  user,
  showAddButton,
  status,
  auth,
  fetchUsers,
  stalker,
  getStalkRequests,
}: IProps) {
  const { addToast } = useToasts();
  const { dispatch } = useDispatch();
  const [statusText, setStatusText] = useState("");

  const addUser = (userId: string) => {
    const callback = () => {
      addToast("User added", {
        appearance: "success",
        autoDismiss: true,
      });
      fetchUsers();
    };
    requestPost(`/api/stalks/${auth.user.id}`, { recipient: userId }, callback);
  };

  const cancelRequest = (userId: string) => {
    const callback = () => {
      addToast("Stalk removed", {
        appearance: "success",
        autoDismiss: true,
      });
      fetchUsers();
    };
    requestDelete(`/api/stalks/cancel/${auth.user.id}`, callback, {
      recipient: userId,
    });
  };

  const actionRequest = (userId: string, action: string) => {
    let message = "";
    if (action === "accept") {
      message = "Stalk request accepted";
    } else if (action === "deny") {
      message = "Stalk request dennied";
    }
    const callback = () => {
      addToast(message, {
        appearance: "success",
        autoDismiss: true,
      });
      fetchUsers();
      getStalkRequests(auth.user);
    };
    requestPut(
      `/api/stalks/${action}/${auth.user.id}`,
      { requester: userId },
      callback
    );
  };

  const renderStatus = () => {
    switch (status) {
      case 0:
        return (
          <Button
            variant="outline-primary"
            className="stalkReqButton"
            onClick={() => addUser(user._id)}
          >
            Stalk
          </Button>
        );
      case 1:
        if (stalker) {
          return (
            <div style={{ display: "flex" }}>
              <Button
                variant="success"
                className="stalkReqButton"
                style={{ marginRight: "5px" }}
                onClick={() => actionRequest(user._id, "accept")}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                className="stalkReqButton"
                onClick={() => actionRequest(user._id, "deny")}
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
              onClick={() => cancelRequest(user._id)}
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
            onClick={() => cancelRequest(user._id)}
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
            onClick={() => cancelRequest(user._id)}
          >
            {statusText ? statusText : "Stalk denied"}
          </Button>
        );
    }
  };
  return (
    <Card className="userCard">
      <Card.Body className="userCard-body">
        <div className="userCard-body__header">
          <div className="userImage">
            {user.userImage && (
              <Card.Img
                className="userImg"
                variant="top"
                src={user.userImage.image}
              />
            )}
          </div>
          <div className="landscape">
            {user.userImage && (
              <Card.Img
                className={user.userImage.landscape?"landscapeImg":"landscapeImgUser"}
                variant="top"
                src={user.userImage.landscape?user.userImage.landscape:user.userImage.image}
              />
            )}
          </div>
          <Card.Title className="userName">
            <Link to={`user/${user.name}`} className="nav-link">
              <span>@{user.name}</span>
            </Link>
          </Card.Title>
          <Card.Text className="userBio">
            {user.userInfo &&
              (user.userInfo.bio.length > 69
                ? user.userInfo.bio.slice(0, 69).concat("...")
                : user.userInfo.bio)}
          </Card.Text>
        </div>
        <div className="userCard-body__footer">
          {showAddButton && renderStatus()}
        </div>
      </Card.Body>
    </Card>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
  stalkers: state.stalkers,
});
export default connect(mapStateToProps, { getStalkRequests })(UserCard);
