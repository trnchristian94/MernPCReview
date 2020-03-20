import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { connect, useDispatch } from "react-redux";

interface IProps {
  auth: any;
  user: {
    _id?: string;
    name: string;
    userImage?: { image: string };
    userInfo?: { bio: string };
  };
  showAddButton: boolean;
  status?: number;
  fetchUsers?: any;
  stalker?: boolean;
}

function UserCard({
  user,
  showAddButton,
  status,
  auth,
  fetchUsers,
  stalker
}: IProps) {
  const { addToast } = useToasts();
  const { dispatch } = useDispatch();
  const [statusText, setStatusText] = useState("");

  const addUser = (userId: string) => {
    fetch(`/api/stalks/${auth.user.id}`, {
      method: "POST",
      body: JSON.stringify({ recipient: userId }),
      headers: {
        Authorization: localStorage.jwtToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        addToast(data.status, {
          appearance: "success",
          autoDismiss: true
        });
        fetchUsers();
      })
      .catch(err => console.log(err));
  };

  const cancelRequest = (userId: string) => {
    fetch(`/api/stalks/cancel/${auth.user.id}`, {
      method: "DELETE",
      body: JSON.stringify({ recipient: userId }),
      headers: {
        Authorization: localStorage.jwtToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        addToast(data.status, {
          appearance: "success",
          autoDismiss: true
        });
        fetchUsers();
      })
      .catch(err => console.log(err));
  };

  const actionRequest = (userId: string, action: string) => {
    fetch(`/api/stalks/${action}/${auth.user.id}`, {
      method: "PUT",
      body: JSON.stringify({ requester: userId }),
      headers: {
        Authorization: localStorage.jwtToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        addToast(data.status, {
          appearance: "success",
          autoDismiss: true
        });
        fetchUsers();
      })
      .catch(err => console.log(err));
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
      // Stop stalking, blue background, red background hover, white text
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
          <Card.Title className="userName">@{user.name}</Card.Title>
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
  errors: state.errors
});
export default connect(mapStateToProps)(UserCard);
