import React, { Component } from "react";
import { Link } from "react-router-dom";

declare const M: any;
type MyProps = {};
type MyState = {
  _id: any;
  title: any;
  description: any;
  tasks: Array<any>;
  [x: number]: any;
};

class Task extends Component<MyProps, MyState> {
  constructor() {
    super(null);
    this.state = {
      title: "",
      description: "",
      tasks: [],
      _id: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  addTask(e: any) {
    console.log("adding task");
    console.log(this.state);
    if (this.state._id) {
      fetch(`/api/tasks/${this.state._id}`, {
        method: "PUT",
        body: JSON.stringify(this.state),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          M.toast({ html: "Task updated" });
          this.setState({ title: "", description: "", _id: "" });
          this.fetchTasks();
        });
    } else {
      fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(this.state),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          M.toast({ html: "Task Saved" });
          this.setState({ title: "", description: "" });
          this.fetchTasks();
        })
        .catch(err => console.log(err));
    }
    e.preventDefault(); // Evita que el navegador actualice.
  }

  componentDidMount() {
    console.log("El componente se montó");
    this.fetchTasks();
  }

  fetchTasks() {
    fetch("/api/tasks") // Por defecto es GET
      .then(res => res.json())
      .then(data => {
        this.setState({ tasks: data });
        console.log(this.state.tasks);
      });
  }

  deleteTask(id: string) {
    if (confirm("Are you sure you want to delete this?")) {
      console.log("Eliminando " + id);
      fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          M.toast({ html: "Task Deleted" });
          this.fetchTasks();
        });
    }
  }

  editTask(id: string) {
    console.log("Editando " + id);
    fetch(`/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          title: data.title,
          description: data.description,
          _id: data._id
        });
      });
  }

  handleChange(e: any) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <div className="container">
        <Link to="/" className="btn-flat waves-effect">
          <i className="material-icons left">keyboard_backspace</i> Back to home
        </Link>
        <div className="row">
          <div className="col s5">
            <div className="card">
              <div className="card-content">
                <form onSubmit={this.addTask}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        name="title"
                        onChange={this.handleChange}
                        type="text"
                        placeholder="Task title"
                        value={this.state.title}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <textarea
                        name="description"
                        onChange={this.handleChange}
                        className="materialize-textarea"
                        placeholder="Task description"
                        value={this.state.description}
                      />
                    </div>
                  </div>
                  <button className="btn light-blue darken-4">Send</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col s7">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tasks.map(task => {
                  return (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>
                        <button
                          className="btn light-blue darken-4"
                          onClick={() => this.editTask(task._id)}
                        >
                          <i className="material-icons">edit</i>
                        </button>
                        <button
                          className="btn light-blue darken-4"
                          style={{ margin: "4px" }}
                          onClick={() => this.deleteTask(task._id)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default Task;
