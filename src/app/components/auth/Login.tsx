import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { loginUser } from "userLogic/actions/authActions";
import { Form, Button, Col } from "react-bootstrap";

type MyProps = {
  loginUser: any;
  auth: any;
  errors: any;
  history: any;
};
type MyState = {
  email: string;
  password: string;
  errors: {
    email: string;
    password: string;
    emailnotfound: string;
    passwordincorrect: string;
  };
  [x: number]: any;
};
class Login extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
        emailnotfound: "",
        passwordincorrect: ""
      }
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  handleChange = (e: any) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  login = (e: any) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };
  render() {
    const errors = this.state.errors;
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }}>
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              Back to home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <Form noValidate onSubmit={this.login}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    id="email"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend"
                    value={this.state.email}
                    onChange={this.handleChange}
                    isValid={
                      errors.email === undefined &&
                      errors.emailnotfound === undefined
                    }
                    isInvalid={
                      errors.email !== undefined ||
                      errors.emailnotfound !== undefined
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                    {errors.emailnotfound}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    isValid={
                      errors.password === undefined &&
                      errors.passwordincorrect === undefined
                    }
                    isInvalid={
                      errors.password !== undefined ||
                      errors.passwordincorrect !== undefined
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                    {errors.passwordincorrect}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Button type="submit">Login</Button>
            </Form>
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
export default connect(mapStateToProps, { loginUser })(Login);
