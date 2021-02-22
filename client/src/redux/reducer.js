export function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS") {
        state = {
            ...state,
            friendsList: action.friendsList,
        };
        console.log("state in get friends(reducer): ", state);
    }

    // if (action.type === "ACCEPT_FRIEND") {
    //     state = { ...state };
    // }
    // if (action.type === "UNFRIEND") {
    //     state = { ...state };
    // }
}

/*
friends -> dispatch -> actions -> server -> reducer -> friends
*/
