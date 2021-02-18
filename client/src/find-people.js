import { useState, useEffect } from "react";
import axios from "./axios";

export function SearchUsers() {
    // "user" is our state property
    // "setuser" is the function we'll use to update "user"
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);

    // const handleChange = (e) => {
    // setUser(e.target.value);
    // };

    useEffect(() => {
        let abort = false;

        (async () => {
            try {
                const { data } = await axios.get(`/api/users/${user}`);
                if (!abort) {
                    setUsers(data);
                }
            } catch (err) {
                console.log("err with axios: ", err);
            }
        })();
        return () => {
            console.log("user in returned function: ", user);
            abort = true;
        };
    }, [user]);

    return (
        <div>
            <h1>USERS</h1>
            <input
                name="user"
                type="text"
                placeholder="user to search"
                onChange={(e) => setUser(e.target.value)}
                // onChange={handleChange}
                autoComplete="off"
            />
            {users.map((elem, index) => {
                return <p key={index}>{elem}</p>;
            })}
        </div>
    );
}
