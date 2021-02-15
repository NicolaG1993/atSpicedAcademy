import React from "react";
// import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            editingMode: false,
        };
    }

    render() {
        console.log("this.props in BioEditor: ", this.props);
        if (this.state.editingMode) {
            return (
                <div>
                    <h1>EDIT MODE!!!</h1>
                    <textarea defaultValue="This is a default bio"></textarea>
                    <button>Save Bio</button>
                </div>
            );
        }
        return (
            <div className="purple-frame">
                <h1>I am the Bio Editor!</h1>
                <p>this will be the user bio we get from props</p>
                <button>Click me!</button>
            </div>
        );
    }
}
