import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "userLogic/actions/authActions";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

type MyProps = {
  registerUser: any;
  auth: any;
  errors: any;
  history: any;
};
type MyState = {
  name: string;
  email: string;
  password: string;
  password2: string;
  errors: { name: string; email: string; password: string; password2: string };
  [x: number]: any;
};
class Register extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: { name: "", email: "", password: "", password2: "" }
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  handleChange = (e: any) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  register = (e: any) => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
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
                <b>Register</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <Form noValidate onSubmit={this.register}>
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
                    isValid={errors.email === undefined}
                    isInvalid={errors.email !== undefined}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">
                        @
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      id="name"
                      placeholder="Username"
                      aria-describedby="inputGroupPrepend"
                      value={this.state.name}
                      onChange={this.handleChange}
                      isValid={errors.name === undefined}
                      isInvalid={errors.name !== undefined}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </InputGroup>
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
                    isValid={errors.password === undefined}
                    isInvalid={errors.password !== undefined}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password2"
                    placeholder="Confirm password"
                    onChange={this.handleChange}
                    value={this.state.password2}
                    isValid={errors.password2 === undefined}
                    isInvalid={errors.password2 !== undefined}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password2}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Button type="submit">Sign Up</Button>
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
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
