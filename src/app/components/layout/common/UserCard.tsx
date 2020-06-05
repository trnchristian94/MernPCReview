import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import StalkButton from "src/app/components/layout/common/StalkButton";

import Card from "react-bootstrap/Card";

import "./UserCard.scss";

interface IProps {
  auth: any;
  user: {
    _id?: string;
    name: string;
    userImage?: { image: string; landscape: string };
    userInfo?: { bio: string };
  };
  showAddButton: boolean;
  fetchUsers?: any;
  stalker?: boolean;
  status?: number;
}

function UserCard({
  user,
  showAddButton,
  fetchUsers,
  stalker,
  status
}: IProps) {
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
                className={
                  user.userImage.landscape ? "landscapeImg" : "landscapeImgUser"
                }
                variant="top"
                src={
                  user.userImage.landscape
                    ? user.userImage.landscape
                    : user.userImage.image
                }
              />
            )}
          </div>
          <Card.Title className="userName">
            <Link to={`/user/${user.name}`} className="nav-link">
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
          {showAddButton && <StalkButton status={status} fetchUsers={fetchUsers} userId={user._id} stalker={stalker} />}
        </div>
      </Card.Body>
    </Card>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors,
  stalkers: state.stalkers
});
export default connect(mapStateToProps)(UserCard);
