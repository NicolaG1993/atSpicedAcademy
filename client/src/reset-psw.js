import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            codeSended: false,
            pswUpdated: false,
            email: "",
            password: "",
            code: "",
            renderView: 1,
        };
    }

    handleClick() {
        if (this.state.renderView === 1) {
            if (this.state.email == "") {
                this.setState({
                    error: true,
                });
            } else {
                axios
                    .post("/password/reset/start", this.state)
                    .then((resp) => {
                        console.log("resp from server: ", resp);
                        if (resp.data.codeSended) {
                            this.setState({
                                renderView: 2,
                            });
                        } else {
                            this.setState({
                                error: true,
                            });
                        }
                        // location.replace("/");
                    })
                    .catch((err) => {
                        console.log("err in reset-psw: ", err);
                        this.setState({
                            error: true,
                        });
                    });
            }
        }
        if (this.state.renderView === 2) {
            axios
                .post("/password/reset/verify", this.state)
                .then((resp) => {
                    console.log("resp from server: ", resp);
                    if (this.state.password == "" || this.state.code == "") {
                        this.setState({
                            error: true,
                        });
                    } else {
                        axios
                            .post("/password/reset/verify", this.state)
                            .then((resp) => {
                                console.log("resp from server: ", resp);
                                if (resp.data.pswUpdated) {
                                    this.setState({
                                        renderView: 3,
                                    });
                                } else {
                                    this.setState({
                                        error: true,
                                    });
                                }
                                // location.replace("/");
                            })
                            .catch((err) => {
                                console.log("err in reset-psw: ", err);
                                this.setState({
                                    error: true,
                                });
                            });
                    }
                })
                .catch((err) => {
                    console.log("err in reset-psw: ", err);
                    this.setState({
                        error: true,
                    });
                });
        }
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

    determineWhichViewToRender() {
        // this method determines what the render!
        if (this.state.renderView === 1) {
            return (
                <div>
                    {this.state.error && <p>Something broke :(</p>}
                    <h1>Reset Password</h1>

                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <br />
                    <button onClick={() => this.handleClick()}>Submit</button>
                    <br />
                    <Link to="/">Create an account!</Link>
                    <br />
                    <Link to="/login">Click here to Log in!</Link>
                </div>
            );
        } else if (this.state.renderView === 2) {
            return (
                <div>
                    <h1>Insert the secret code</h1>
                    <br />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <br />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        type="password"
                        placeholder="code"
                    />
                    <br />
                    <button onClick={() => this.handleClick()}>Update</button>
                </div>
            );
        } else if (this.state.renderView === 3) {
            return (
                <div>
                    <h1>Success</h1>
                    <Link to="/login">Click here to Log in!</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.state.error && <p>error</p>}
                {/* call the method */}
                {this.determineWhichViewToRender()}
            </div>
        );
    }
}
