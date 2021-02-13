export function ProfilePic(props) {
    console.log(props);

    return (
        <div className="profile-pic">
            <img
                src={props.profilePicUrl || "default.png"}
                alt={`${props.firstName}`}
            />
        </div>
    );
}
