import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import {
  requestGet,
  requestPut,
  requestPost,
  requestDelete
} from "utils/request";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export default function Task() {
  const { addToast } = useToasts();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [_id, setId] = useState("");

  const showToast = (message: string) => {
    addToast(message, {
      appearance: "success",
      autoDismiss: true
    });
  };

  const addTask: any = (e: any) => {
    if (_id) {
      const callback = () => {
        showToast("Task updated");
        setTitle("");
        setDescription("");
        setId("");
        fetchTasks();
      };
      requestPut(`/api/tasks/${_id}`, { title, description }, callback);
    } else {
      const callback = () => {
        showToast("Task updated");
        setTitle("");
        setDescription("");
        fetchTasks();
      };
      requestPost("/api/tasks", { title, description, callback }, callback);
    }
    e.preventDefault(); // Evita que el navegador actualice.
  };

  const fetchTasks = () => {
    requestGet("/api/tasks", setTasks);
  };

  const deleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this?")) {
      const callback = () => {
        showToast("Task deleted");
        fetchTasks();
      };
      requestDelete(`/api/tasks/${id}`, callback);
    }
  };

  // Buscar cómo crear función para esto.
  const editTask = (id: string) => {
    fetch(`/api/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setId(data._id);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container fluid style={{ maxWidth: "75%", paddingTop: "4rem" }}>
      <Row>
        <Col lg={true}>
          <Card className="pcCard" style={{ padding: "15px" }}>
            <Form noValidate onSubmit={addTask}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Task</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Task description"
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Button type="submit">Send</Button>
            </Form>
          </Card>
        </Col>
        <Col lg={true}>
          <Row>
            {tasks.map((task) => {
              return (
                <Card
                  key={task._id}
                  className="pcCard"
                  style={{
                    width: "200px",
                    marginTop: "10px",
                    marginLeft: "10px"
                  }}
                >
                  <Card.Body>
                    <Card.Title>{task.title}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                    <Button
                      variant="primary"
                      className="mr-2"
                      onClick={() => editTask(task._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
