import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row, Container, Card } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

export default function Task() {
  const { addToast } = useToasts();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [_id, setId] = useState("");

  const addTask: any = (e: any) => {
    if (_id) {
      fetch(`/api/tasks/${_id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          addToast("Task updated", {
            appearance: "success",
            autoDismiss: true
          });
          setTitle("");
          setDescription("");
          setId("");
          fetchTasks();
        });
    } else {
      fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          addToast("Task saved", {
            appearance: "success",
            autoDismiss: true
          });
          setTitle("");
          setDescription("");
          fetchTasks();
        })
        .catch(err => console.log(err));
    }
    e.preventDefault(); // Evita que el navegador actualice.
  };

  const fetchTasks = () => {
    fetch("/api/tasks") // Por defecto es GET
      .then(res => res.json())
      .then(data => {
        setTasks(data);
      });
  };

  const deleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this?")) {
      fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          addToast("Task deleted", {
            appearance: "success",
            autoDismiss: true
          });
          fetchTasks();
        });
    }
  };

  const editTask = (id: string) => {
    fetch(`/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
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
          <Card style={{ padding: "15px", width: "400px" }}>
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
            {tasks.map(task => {
              return (
                <Card
                  key={task._id}
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
