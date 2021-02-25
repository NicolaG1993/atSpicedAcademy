import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    console.log("CHAT COMPONENT ACTIVATED");
    const elemRef = useRef();

    const [message, setMessage] = useState("");
    const messages = useSelector((state) => state.messages);
    // const message = useSelector((state) => state.message);

    useEffect(() => {
        if (messages) {
            //console.log("messages in useEffect: ", messages);
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        }
    }, [messages]);

    const submitMessage = (e) => {
        //console.log("messages in submitMessage: ", messages);
        if (e.key === "Enter") {
            // e.preventDefault(); // ?
            socket.emit("postMessage", message);
            e.target.value = "";
        }
    };

    return (
        <div>
            <h1>GROUP CHAT</h1>
            <div className="chatBox" ref={elemRef}>
                {messages &&
                    messages.map((elem, index) => (
                        <div className="message" key={index}>
                            <img
                                src={elem.profile_pic_url || "default.jpg"}
                                size="small"
                            />
                            <p>
                                {elem.first} {elem.last}:
                            </p>
                            <p>{elem.message}</p>
                        </div>
                    ))}
            </div>

            <div className="textareaBox">
                <textarea
                    cols="100"
                    rows="5"
                    placeholder="Your text here"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => submitMessage(e)}
                ></textarea>
                <br />
                <button onClick={(e) => submitMessage(e)}>Send</button>
            </div>
        </div>
    );
}
