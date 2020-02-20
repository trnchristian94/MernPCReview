import React, { Component } from "react";
import { Link } from "react-router-dom";

declare const M: any;
type MyProps = {};
type MyState = {
  _id: string;
  userName: string;
  email: string;
  users: Array<any>;
  [x: number]: any;
};

class UserList extends Component<MyProps, MyState> {
  constructor() {
    super(null);
    this.state = {
      userName: "",
      email: "",
      users: [],
      _id: ""
    };
  }
  
  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    fetch("/api/userList") // Por defecto es GET
      .then(res => res.json())
      .then(data => {
        this.setState({ users: data });
        console.log(this.state.users);
      });
  }

  render() {
    return (
      <div className="container">
        <Link to="/" className="btn-flat waves-effect">
          <i className="material-icons left">keyboard_backspace</i> Back to home
        </Link>
        <div className="row">
          <div className="col s12">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users.map(user => {
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn light-blue darken-4"
                          //onClick={() => this.addUser(task._id)}
                        >
                          <i className="material-icons">add</i>
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
export default UserList;
