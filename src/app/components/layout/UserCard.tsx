import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

interface IProps {
  user: {
    id?: string;
    name: string;
    userImage?: { image: string };
    userInfo?: { bio: string };
  };
  showAddButton: boolean;
}

export default function UserCard({ user, showAddButton }: IProps) {
  const { addToast } = useToasts();
  const addUser = (e?: any) => {
    addToast("User added", {
      appearance: "success",
      autoDismiss: true
    });
  };
  return (
    <Card className="userCard">
      <Card.Body className="userCard-body">
        <div className="userCard-body__header">
          {user.userImage && (
            <div className="userImage">
              <Card.Img
                className="userImg"
                variant="top"
                src={user.userImage.image}
              />
            </div>
          )}
          <Card.Title className="userName">@{user.name}</Card.Title>
          <Card.Text className="userBio">
            {user.userInfo &&
              (user.userInfo.bio.length > 69
                ? user.userInfo.bio.slice(0, 69).concat("...")
                : user.userInfo.bio)}
          </Card.Text>
        </div>
        <div className="userCard-body__footer">
          {showAddButton && (
            <Button variant="primary" onClick={() => addUser()}>
              Add user as Friend
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
