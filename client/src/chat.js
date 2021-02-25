import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    console.log("CHAT COMPONENT ACTIVATED");

    const messages = useSelector((state) => state.messages);
    // const message = useSelector((state) => state.message);

    useEffect(() => {});
}
