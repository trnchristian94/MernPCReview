import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function UserList({ auth, errors, history }: Props) {
  const { addToast } = useToasts();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [_id, setId] = useState("");
  const [img, setImg] = useState();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = () => {
    fetch("/api/userList") // Por defecto es GET
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      });
  };

  const addUser = (e: any) => {
    addToast("User added", {
      appearance: "success",
      autoDismiss: true
    });
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        <Row>
          {users.map((user: any) => {
            return (
              <Card
                key={user._id}
                style={{ margin: "15px 0px 0px 15px", width: "200px" }}
              >
                {img && <Card.Img variant="top" src="holder.js/100px180" />}
                <Card.Body>
                  <Card.Title>@{user.name}</Card.Title>
                  <Card.Text>{user.email}</Card.Text>
                  <Button variant="primary" onClick={() => addUser(user._id)}>
                    Add user as Friend
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(UserList);
