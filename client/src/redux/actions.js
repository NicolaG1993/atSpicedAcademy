import axios from "../axios";

export async function getFriends() {
    try {
        const { data } = await axios.get("/get-friends");
        console.log("data in get friends(actions): ", data);
        return {
            type: "GET_FRIENDS",
            friendsList: data,
        };
    } catch (err) {
        console.log("err in get-friends(getFriends): ", err);
    }
}

export async function acceptFriendship() {
    try {
        const { data } = await axios.get("/get-friends", {
            buttonText: "Accept friend request",
        });
        return {
            type: "ACCEPT_FRIEND",
            friendsList: data,
        };
    } catch (err) {
        console.log("err in get-friends(acceptFriendship): ", err);
    }
}

export async function declineFriendship() {
    try {
        const { data } = await axios.get("/get-friends", {
            buttonText: "Cancel friend request",
        });
        return {
            type: "UNFRIEND",
            friendsList: data,
        };
    } catch (err) {
        console.log("err in get-friends(declineFriendship): ", err);
    }
}
