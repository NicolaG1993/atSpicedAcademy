import { Link } from "react-router-dom";
export default function ProfilePic(props) {
    console.log("props in profile-pic.js: ", props);

    if (props.size === "medium") {
        return (
            <div className="profile-pic">
                <img
                    onClick={props.toggleUploader}
                    src={props.profilePicUrl || "/default.jpg"}
                    alt={`${props.firstName} ${props.lastName}`}
                    className={`${props.size} white-frame`}
                />
            </div>
        );
    }
    if (props.size === "small") {
        return (
            <div className="profile-pic">
                <Link to={"/"}>
                    <img
                        src={props.profilePicUrl || "/default.jpg"}
                        alt={`${props.firstName} ${props.lastName}`}
                        className={`${props.size} white-frame`}
                    />
                </Link>
            </div>
        );
    }
}
