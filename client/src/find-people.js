import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function SearchUsers() {
    // "user" is our state property
    // "setuser" is the function we'll use to update "user"
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log("Find People mounted");
        let abort = false;

        (async () => {
            try {
                console.log("user in Find People: ", user);
                if (user) {
                    const { data } = await axios.get(`/api/find-users/${user}`);
                    console.log("data in Find People: ", data);
                    if (!abort) {
                        console.log("!abort");
                        setUsers(data);
                    }
                } else {
                    const { data } = await axios.get(
                        `/api/find-users/pageload`
                    );
                    console.log("data in Find People: ", data);
                    if (!abort) {
                        console.log("!abort");
                        setUsers(data);
                    }
                }
            } catch (err) {
                console.log("err with axios: ", err);
                abort = true;
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
                autoComplete="off"
            />

            {users.map((user, index) => {
                return (
                    <div key={index}>
                        <Link to={`/user/${user.id}`}>
                            <img
                                className="findusers"
                                src={user.profile_pic_url || "/default.jpg"}
                                alt={`${user.first} ${user.last}`}
                            />
                            <p>
                                {user.first} {user.last}
                            </p>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
