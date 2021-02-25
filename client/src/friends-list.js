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

    const friends = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((friend) => friend.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((friend) => !friend.accepted)
    );

    console.log("friends: ", friends);
    console.log("wannabes: ", wannabes);

    //useEffect here -> dispatch the fn i have in action
    useEffect(() => {
        dispatch(getFriends());
        // return () => {}; // ?
    }, []);

    //devo capire come imposto accepted, credo in reducer

    if (!friends || !wannabes) {
        console.log("friends: ", friends);
        console.log("wannabes: ", wannabes);
        return null;
        // return (
        //     <div className="spinner-container">
        //         <div className="spinner"></div>
        //     </div>
        // );
        // return (
        //     <div>
        //         <h2>My Friends</h2>
        //         <p>No results</p>
        //     </div>
        // );
    }
    //eliminare questo if oppure friends.length

    return (
        <div>
            <h2>My Friends</h2>
            {friends.map((elem, index) => {
                return (
                    <div key={index}>
                        <img
                            src={elem.profile_pic_url || "/default.jpg"}
                            alt={`${elem.first} ${elem.last}`}
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
            {wannabes.map((elem, index) => {
                return (
                    <div key={index}>
                        <img
                            src={elem.profile_pic_url || "/default.jpg"}
                            alt={`${elem.first} ${elem.last}`}
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

// Remember that the whole process of putting data into redux is asynchronous - it all takes a bit of time! But the problem is that that map does not wait for data to actually exist in Redux before running. So the solution is to, in some way, tell map not to run until the data in Redux is there
// questo é perche scrivo "friends.length &&" o solo "friends(?)" prima di usare friends.map
