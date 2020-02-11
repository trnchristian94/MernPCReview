import React, { Component } from "react";
import { Link } from "react-router-dom";
import { string, any } from "prop-types";

type MyProps = {};
type MyState = {
  name: string;
  email: string;
  password: string;
  password2: string;
  errors: { name: string; email: string; password: string; password2: string };
  [x: number]: any;
};
class Register extends Component<MyProps, MyState> {
  constructor() {
    super(null);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {name: "", email: "", password: "", password2: ""}
    };
  }
  handleChange(e: any) {
    this.setState({ [e.target.id]: e.target.value });
  }
  register(e: any) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    console.log(newUser);
  }
  render() {
    const errors = this.state.errors;
    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Register</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.register}>
              <div className="input-field col s12">
                <input
                  onChange={this.handleChange}
                  value={this.state.name}
                  data-error={errors.name}
                  id="name"
                  type="text"
                />
                <label htmlFor="name">Name</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.handleChange}
                  value={this.state.email}
                  data-error={errors.email}
                  id="email"
                  type="email"
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.handleChange}
                  value={this.state.password}
                  data-error={errors.password}
                  id="password"
                  type="password"
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.handleChange}
                  value={this.state.password2}
                  data-error={errors.password2}
                  id="password2"
                  type="password"
                />
                <label htmlFor="password2">Confirm Password</label>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
