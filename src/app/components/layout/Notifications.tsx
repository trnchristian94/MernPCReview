import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import { connect } from "react-redux";
import req from "utils/request";
import { checkLogin } from "utils/connection";

import Favorite from "@material-ui/icons/Favorite";
import GroupRounded from "@material-ui/icons/GroupRounded";
import FeedbackIcon from "@material-ui/icons/Feedback";
import Cached from "@material-ui/icons/Cached";
import Avatar from "@material-ui/core/Avatar";
import { formatDate, formatHour } from "utils/date";

import "./Notification.scss";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function Notifications({ auth, history }: Props) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (checkLogin(auth, history)) fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    req.get(`/api/notifications`, setNotifications);
  };

  const formatContent = (content: any, contentModel: String) => {
    let formatedContent = [];
    switch (contentModel) {
      case "Post":
        formatedContent.push(<span>{content.text}</span>);
        break;
      case "Repost":
        formatedContent.push(<span>{content.post.text}</span>);
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
        break;
      case "answer":
        icon.push(<FeedbackIcon className="answer" />);
        break;
      case "repost":
        icon.push(<Cached className="repost" />);
        break;
      default:
        break;
    }
    return icon;
  };

  return (
    <Container style={{ paddingTop: "4rem" }}>
      <Col lg={true}>Notifications</Col>
      {notifications.length > 0 &&
        notifications.map((notification: any) => {
          return (
            <div
              className={`notification ${!notification.read ? "unread" : ""}`}
              key={notification.id}
            >
              <div className="avatarHeader">
                <div className="notification__icon">
                  {formatIcon(notification.iconType)}
                </div>
                <Avatar
                  alt={`${notification.fromUser.name} profile image`}
                  className="avatarImg"
                  src={notification.fromUser.userImage.image}
                  onClick={() => history.push(`/user/${notification.fromUser.name}`)}
                />
                <div className="notification__date">
                  {`${formatDate(notification.date)} ${formatHour(
                    notification.date
                  )}`}
                </div>
              </div>
              <div className="notification__message">
                {notification.message}
              </div>
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
