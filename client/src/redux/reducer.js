export function reducer(state = {}, action) {
    if (action.type === "GET_FRIENDS") {
        state = {
            ...state,
            friendsList: action.friendsList,
        };
        console.log("state in get friends(reducer): ", state);
    }

    if (action.type === "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendsList: state.friendsList.map((elem) => {
                if (elem.id === action.profileId) {
                    return {
                        ...elem,
                        accepted: true,
                    };
                } else {
                    return elem;
                }
            }),
        };
    }

    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsList: state.friendsList.filter(
                (elem) => elem.id !== action.profileId
            ),
        };
    }
}

/*
friends -> dispatch -> actions -> server -> reducer -> friends
*/

//non ho capito molto bene la parte ACCEPT_FRIEND e UNFRIEND (cosa fanno veramente map e filter?)
// friendlist é l'array finale che andremo ad utilizzare in friends component
// ...state va semplicemente usato sempre, perché non puo essere modificato in reducer
// map e filter servono clonarlo e tirare fuori i risultati che ci servono in friends

// GET_LIST or RECEIVE_FRIENDS_WANNABES - clones the global state and adds to it a property called friendsWannabes whose value is the array of friends and wannabes
//questo in pt9 non l'ho capito
