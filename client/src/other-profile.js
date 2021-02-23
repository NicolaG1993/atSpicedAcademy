import { Component } from "react";
import axios from "./axios";
import FriendshipButton from "./friend-btn";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    async componentDidMount() {
        console.log("OtherProfile component did mount");
        console.log("this.props.match: ", this.props.match);
        console.log("id: ", this.props.match.params.id);
        // we should  make a request to our server to get the other user's data using the id

        //my code
        try {
            const { data } = await axios.get(
                `/api/other-profile/${this.props.match.params.id}`
            );
            //devo passare anche id?
            console.log("data --> other-profile: ", data);

            // If we are trying to view our own profile,
            // we should make sure to send the user back to the '/' route
            if (this.props.match.params.id == this.props.userId) {
                return this.props.history.push("/");
            }
            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                profilePicUrl: data.profile_pic_url,
                bio: data.bio,
            });
        } catch (err) {
            console.log("err in /other-profile component-->get user: ", err);
            this.setState({
                error: true,
            });
        }
    }

    render() {
        console.log("this.props in OtherProfile: ", this.props);
        console.log("this.state in OtherProfile: ", this.state);
        if (!this.state.id) {
            return null;
            // return (
            //     <div className="spinner-container">
            //         <div className="spinner"></div>
            //     </div>
            // );
        }
        return (
            <div className="otherProfile">
                <h1>Other Profile Component</h1>
                <img
                    src={this.state.profilePicUrl || "/default.jpg"}
                    alt={`${this.state.first} ${this.state.last}`}
                    className={`${this.props.size} blue-frame`}
                />
                <h2>
                    {this.state.first} {this.state.last}
                </h2>
                <p>{this.state.bio}</p>
                <FriendshipButton profileId={this.state.id} />
            </div>
        );
    }
}
