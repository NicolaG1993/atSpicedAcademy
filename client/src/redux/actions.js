import axios from "../axios";

export async function getFriends() {
    try {
        const { data } = await axios.get("/api/get-friends");
        console.log("data in getFriends(actions): ", data);
        return {
            type: "GET_FRIENDS",
            payload: data,
        };
    } catch (err) {
        console.log("err in getFriends(actions): ", err);
    }
}

export async function acceptFriendship(profileId) {
    try {
        const { data } = await axios.post(`/api/friendship/${profileId}`, {
            buttonText: "Accept friend request",
        });
        console.log("data in post acceptFriendship(actions): ", data);
        console.log("profileId in acceptFriendship(actions): ", profileId);
        return {
            type: "ACCEPT_FRIEND",
            friendsList: data,
            profileId: profileId, // controllare key ?
        };
    } catch (err) {
        console.log("err in acceptFriendship(actions): ", err);
    }
}

export async function declineFriendship(profileId) {
    try {
        const { data } = await axios.post(`/api/friendship/${profileId}`, {
            buttonText: "Cancel friend request",
        });
        console.log("data in post declineFriendship(actions): ", data);
        return {
            type: "UNFRIEND",
            friendsList: data,
            profileId: profileId, // controllare key ?
        };
    } catch (err) {
        console.log("err in declineFriendship(actions): ", err);
    }
}

export async function chatMessages(msgs) {
    try {
        console.log("msgs in chatMessages(actions): ", msgs);
        return {
            type: "GET_MSGS",
            payload: msgs,
        };
    } catch (err) {
        console.log("err in chatMessages(actions): ", err);
    }
}

export async function chatMessage(msg) {
    try {
        console.log("msg in chatMessage(actions): ", msg);
        return {
            type: "POST_MSG",
            payload: msg,
        };
    } catch (err) {
        console.log("err in chatMessage(actions): ", err);
    }
}

//nelle ultime due devo passare un id ed usare un altra route
