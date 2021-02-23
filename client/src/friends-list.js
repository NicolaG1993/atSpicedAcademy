import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriends,
    acceptFriendship,
    declineFriendship,
} from "./redux/actions";

export default function Friends() {
    console.log("FRIENDS COMPONENT ACTIVATED");
    const dispatch = useDispatch();
    const wannabes = useSelector((state) => {
        state.friendsList &&
            state.friendsList.filter((friendsList) => !friendsList.accepted);
    });
    const friends = useSelector((state) => {
        state.friendsList &&
            state.friendsList.filter((friendsList) => friendsList.accepted);
    });

    //useEffect here -> dispatch the fn i have in action
    useEffect(() => {
        dispatch(getFriends());
        // return () => {}; // ?
    }, []);

    //devo capire come imposto accepted, credo in reducer
    return (
        <div>
            <h1>FRIENDS LIST</h1>

            <h2>My Friends</h2>
            {friends.map((elem, i) => {
                return (
                    <div key={i}>
                        <img
                            src={elem.profile_pic_url || "/default.jpg"}
                            alt={`${elem.first} ${elem.last}`}
                            size="medium"
                        />
                        <p>
                            {elem.first} {elem.last}
                        </p>

                        <button
                            onClick={() => dispatch(declineFriendship(elem.id))}
                        >
                            Unfriend
                        </button>
                    </div>
                );
            })}

            <h2>Friends wannabe</h2>
            {wannabes.map((elem, i) => {
                return (
                    <div key={i}>
                        <img
                            src={elem.profile_pic_url || "/default.jpg"}
                            alt={`${elem.first} ${elem.last}`}
                            size="medium"
                        />
                        <p>
                            {elem.first} {elem.last}
                        </p>
                        <button
                            onClick={() => dispatch(acceptFriendship(elem.id))}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => dispatch(declineFriendship(elem.id))}
                        >
                            Refuse
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
