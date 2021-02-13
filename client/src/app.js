import { Logo } from "./logo.js";
import { Component } from "react";
import { ProfilePic } from "./profile-pic.js";
import { Uploader } from "./uploader.js";

export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        this.state = { uploaderVisible: false };

        // TODO: Bind methods if needed
    }

    componentDidMount() {
        // Special React Lifecycle Method
        // TODO: Make an axios request to fetch the user's data when the component mounts
        // TODO: update the state when the data is retrieved
    }

    toggleUploader() {
        // TODO: Toggles the "uploaderVisible" state
    }
    setProfilePicUrl(profilePicUrl) {
        // TODO: Updates the "profilePicUrl" in the state
        // TODO: Hides the uploader
    }

    render() {
        return (
            <div className={"app"}>
                <Logo />
                <ProfilePic
                    // Passing down props:
                    firstName={this.state.first}
                    lastName={this.state.lastName}
                    profilePicUrl={this.state.profilePicUrl}
                    // Passing down methods as standard functions (binding needed):
                    toggleUploader={this.toggleUploader}
                />
                {/*Conditionally render the Uploader: */}
                {this.state.uploaderVisible && (
                    <Uploader
                        // Passing down methods with arrow function (no binding needed):
                        setProfilePicUrl={() => this.setProfilePicUrl()}
                    />
                )}
            </div>
        );
    }
}
