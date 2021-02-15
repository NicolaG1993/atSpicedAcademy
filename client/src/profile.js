import ProfilePic from "./profile-pic";

export default function Profile(props) {
    return (
        <div className="turquoise-frame">
            <h1>I am the profile component</h1>
            <ProfilePic profilePicUrl={props.profilePicUrl} size="medium" />
            <h2>
                {props.firstName} {props.lastName}
            </h2>
        </div>
    );
}
