import React, { useEffect, useState } from "react";
import { Container, Form, Col, Card, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

import { formatDate } from "utils/date";

import { connect } from "react-redux";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function MyProfile({ auth, errors, history }: Props) {
  const { addToast } = useToasts();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [id, setId] = useState("");
  const [img, setImg] = useState();

  const { user } = auth;

  const fetchUser = () => {
    fetch("/api/userProfile/" + user.id, {
      headers: {
        Authorization: localStorage.jwtToken
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsername(data.name);
        setEmail(data.email);
        setDate(data.date);
        setEmail(data.email);
        setId(data.id);
      });
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      fetchUser();
    }
  }, []);

  return (
    <Container style={{ paddingTop: "4rem" }}>
      <Col lg={true}>
        Joined {formatDate(date)}
        <Form noValidate>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={userName}
                onChange={(e: any) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Row>
          <Button type="submit">Save profile</Button>
        </Form>
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(MyProfile);
