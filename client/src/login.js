import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            email: "",
            password: "",
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (this.state.email == "" || this.state.password == "") {
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/"); //app?
                }
            })
            .catch((err) => {
                console.log("err in login: ", err);
                return this.setState({
                    error: true,
                });
                // render an error message
            });
    }

    handleChange(e) {
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    render() {
        return (
            <div>
                {this.state.error && <p>Something broke :(</p>}
                <h1>Login</h1>

                <input
                    className="auth-input"
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="adobo0@example.com"
                />
                <br />
                <input
                    className="auth-input"
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <br />
                <button
                    className="auth-button"
                    onClick={() => this.handleClick()}
                >
                    Login
                </button>
                <br />
                <Link to="/">Create an account!</Link>

                <br />
                <Link to="/reset">Click here if you forgot your password!</Link>
            </div>
        );
    }
}
