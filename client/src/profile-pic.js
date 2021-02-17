export default function ProfilePic(props) {
    console.log("props in profile-pic.js: ", props);

    return (
        <div className="profile-pic">
            <img
                onClick={props.toggleUploader}
                src={props.profilePicUrl || "/default.jpg"}
                alt={`${props.firstName} ${props.lastName}`}
                className={`${props.size} blue-frame`}
            />
        </div>
    );
}
