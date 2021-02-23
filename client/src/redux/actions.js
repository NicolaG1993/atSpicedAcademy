import axios from "../axios";

export async function getFriends() {
    try {
        const { data } = await axios.get("/api/get-friends");
        console.log("data in getFriends(actions): ", data);
        return {
            type: "GET_FRIENDS",
            friendsList: data,
        };
    } catch (err) {
        console.log("err in getFriends(actions): ", err);
    }
}
//per quale motivo io devo usare data.rows invece di data???

export async function acceptFriendship(userId) {
    try {
        const { data } = await axios.get(`/api/friendship/${userId}`, {
            buttonText: "Accept friend request",
        });
        console.log("data in get acceptFriendship(actions): ", data);
        return {
            type: "ACCEPT_FRIEND",
            friendsList: data,
            profileId: data.id, // controllare key ?
        };
    } catch (err) {
        console.log("err in acceptFriendship(actions): ", err);
    }
}

export async function declineFriendship(userId) {
    try {
        const { data } = await axios.get(`/api/friendship/${userId}`, {
            buttonText: "Cancel friend request",
        });
        console.log("data in get declineFriendship(actions): ", data);
        return {
            type: "UNFRIEND",
            friendsList: data,
            profileId: data.id, // controllare key ?
        };
    } catch (err) {
        console.log("err in declineFriendship(actions): ", err);
    }
}

//nelle ultime due devo passare un id ed usare un altra route
