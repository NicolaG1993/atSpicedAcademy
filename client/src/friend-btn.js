import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton(props) {
    // needs to get passed the id of the user that we are currently viewing
    // we will either want to befriend that user, cancel a request we made in the past,
    // accept a pending friend request, or end our friendship
    // the id of the other user lives in the OtherProfile component

    // in useEffect we will want to make a request to the server to find out our
    // relationship status with the user we are looking at, and send over some button text

    // on submit/ btn click we want to send the button text to the server,
    //to update our db, and change the btn text asgain, once the DB has
    // been successfully updated
    let profileId = props.profileId;
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        console.log("FriendshipButton mounted");
        let abort = false;

        (async () => {
            try {
                const { data } = await axios.get(
                    `/api/friendship/${profileId}`
                );
                if (!abort) {
                    console.log("!abort");
                    console.log("useEffect data: ", data);
                    setButtonText(data.buttonText);
                }
            } catch (err) {
                console.log("err with axios: ", err);
                abort = true;
            }
        })();
        return () => {
            console.log("profileId in returned function: ", profileId);
            abort = true;
        };
    }, [profileId]);

    const btnRequest = async () => {
        console.log("btnRequest!");
        const { data } = await axios.post(`/api/friendship/${profileId}`, {
            buttonText: buttonText,
        });
        console.log("btnRequest data: ", data);
        setButtonText(data.buttonText);
    };

    return (
        <>
            <button className="btn" onClick={() => btnRequest()}>
                {buttonText}
            </button>
        </>
    );
}
