import BioEditor from "./bio-editor";
import ProfilePic from "./profile-pic";

export default function Profile(props) {
    console.log("Profile.js props", props);
    return (
        <div className="turquoise-frame">
            <h1>I am the profile component</h1>
            <ProfilePic profilePicUrl={props.profilePicUrl} size="medium" />
            <h2>
                {props.firstName} {props.lastName}
            </h2>
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
