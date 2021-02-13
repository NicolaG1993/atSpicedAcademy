import { Component } from "react";

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };
        this.submit = this.submit.bind(this);
    }

    handleChange() {}

    submit() {
        // const formData = new FormData();
        // formData.append("profilePic", this.state)
        // Axios request

        //TODO: Update the state of App with the new ProfilePic once available
        this.props.updateProfilePic(profilePicUrl);
    }

    render() {
        return (
            <div className={"uploader"}>
                <input type="file" />
                <button onClick={this.submit}>Upload</button>
            </div>
        );
    }
}
