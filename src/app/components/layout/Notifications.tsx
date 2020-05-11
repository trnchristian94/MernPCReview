import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import { connect } from "react-redux";
import { requestGet } from "utils/request";

import Favorite from "@material-ui/icons/Favorite";
import GroupRounded from "@material-ui/icons/GroupRounded";
import Avatar from "@material-ui/core/Avatar";
import { formatDate, formatHour } from "utils/date";

import "./Notification.scss";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function Notifications({ auth, errors, history }: Props) {
  const { addToast } = useToasts();
  const { user } = auth;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = () => {
    requestGet(`/api/notifications/${user.id}`, setNotifications);
  };

  const formatContent = (content: any, contentModel: String) => {
    let formatedContent = [];
    switch (contentModel) {
      case "Post":
        formatedContent.push(<span>{content.text}</span>);
        break;
      default:
        formatedContent.push(<span>{content.text}</span>);
        break;
    }
    return formatedContent;
  };

  const formatIcon = (iconType: String) => {
    let icon = [];
    switch (iconType) {
      case "like":
        icon.push(<Favorite className="liked" />);
        break;
        case "stalk":
        icon.push(<GroupRounded className="stalk" />);
      default:
        break;
    }
    return icon;
  };

  const goToProfile = (name: String) => {
    history.push(`/user/${name}`);
  };

  return (
    <Container style={{ paddingTop: "4rem" }}>
      <Col lg={true}>Notifications</Col>
      {notifications.length > 0 && notifications.map((notification: any) => {
        return (
          <div className="notification" key={notification.id}>
            <div className="avatarHeader">
              <div className="notification__icon">
                {formatIcon(notification.iconType)}
              </div>
              <Avatar
                alt={`${notification.fromUser.name} profile image`}
                className="avatarImg"
                src={notification.fromUser.userImage.image}
                onClick={() => goToProfile(notification.fromUser.name)}
              />
              <div className="notification__date">
                {`${formatDate(notification.date)} ${formatHour(
                  notification.date
                )}`}
              </div>
            </div>

            <div className="notification__message">{notification.message}</div>

            <div className="notification__content">
              {formatContent(notification.type, notification.typeModel)}
            </div>
          </div>
        );
      })}
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Notifications);
