import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

type MyProps = {
  auth: any;
  errors: any;
  history: any;
};
type MyState = {
  _id: string;
  userName: string;
  email: string;
  users: Array<any>;
  [x: number]: any;
};

class UserList extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      users: [],
      _id: ""
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    } else {
      this.fetchUsers();
    }
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
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(UserList);
