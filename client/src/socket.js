import { chatMessages, chatMessage } from "./redux/actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("getMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("postMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};
