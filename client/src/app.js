import axios from "./axios";
import { Logo } from "./logo";
import { Component } from "react";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./other-profile";
import { SearchUsers } from "./find-people";

export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        this.state = {
            uploaderVisible: false,
            first: "",
            last: "",
            profilePicUrl: props.profile_pic_url || "",
            bio: "",
            size: "",
        };

        // TODO: Bind methods if needed
        this.toggleUploader = this.toggleUploader.bind(this); //devo farlo se non esporto con default, in quel caso dovrei importare Logo invece di { LOGO }, ad es.
        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    async componentDidMount() {
        console.log("App component did mount");

        // Special React Lifecycle Method
        // TODO: Make an axios request to fetch the user's data when the component mounts
        // TODO: update the state when the data is retrieved
        try {
            const { data } = await axios.get("/user");
            console.log("data: ", data);

            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                profilePicUrl: data.profile_pic_url,
                bio: data.bio,
            });
        } catch (err) {
            console.log("err in app-->componentDidMount: ", err);
        }

        // axios.get("/something", this.state).then().catch((err) => {
        //         console.log("err in app-->componentDidMount: ", err);
        //         this.setState({
        //             error: true,
        //         });
    }

    toggleUploader() {
        console.log("toggleUploader activated");
        // TODO: Toggles the "uploaderVisible" state
        if (this.state.uploaderVisible) {
            this.setState({
                uploaderVisible: false,
            });
        } else {
            this.setState({
                uploaderVisible: true,
            });
        }
    }

    setProfilePicUrl(profilePicUrl) {
        console.log("setProfilePicUrl activated");
        // TODO: Updates the "profilePicUrl" in the state
        // TODO: Hides the uploader
        this.setState({
            profilePicUrl: profilePicUrl,
            uploaderVisible: false,
        });
    }

    setBio(bioText) {
        console.log("setBio activated");
        this.setState({
            bio: bioText,
        });
    }

    render() {
        console.log("this.state in app: ", this.state);
        if (!this.state.id) {
            return null;
            // return (
            //     <div className="spinner-container">
            //         <div className="spinner"></div>
            //     </div>
            // );
        }
        return (
            <BrowserRouter>
                <div className={"app red-frame"}>
                    <div className={"header"}>
                        <Logo />
                        <ProfilePic
                            // Passing down props:
                            firstName={this.state.first}
                            lastName={this.state.last}
                            profilePicUrl={this.state.profilePicUrl}
                            // Passing down methods as standard functions (binding needed):
                            toggleUploader={this.toggleUploader}
                            size="small"
                        />
                    </div>

                    <div className={"main green-frame"}>
                        {this.state.error && <p>Something broke :(</p>}
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    // Passing down props:
                                    firstName={this.state.first}
                                    lastName={this.state.last}
                                    profilePicUrl={this.state.profilePicUrl}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            )}
                        />

                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    userId={this.state.id}
                                />
                            )}
                        />

                        <Route
                            path="/users"
                            render={(props) => (
                                <SearchUsers key={props.match.url} />
                            )}
                        />

                        {/*Conditionally render the Uploader: */}
                        {this.state.uploaderVisible && (
                            <Uploader
                                // Passing down methods with arrow function (no binding needed):
                                setProfilePicUrl={(profilePicUrl) =>
                                    this.setProfilePicUrl(profilePicUrl)
                                }
                            />
                        )}
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
