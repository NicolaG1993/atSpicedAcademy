import BioEditor from "./bio-editor";
import ProfilePic from "./profile-pic";

export default function Profile(props) {
    console.log("Profile.js props", props);
    return (
        <div className="profileComp">
            <h1>
                {props.firstName} {props.lastName}
            </h1>
            <ProfilePic profilePicUrl={props.profilePicUrl} size="medium" />
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
