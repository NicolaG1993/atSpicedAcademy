const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const cookieSession = require("cookie-session");
let cookie_sec;
if (process.env.secretCookie) {
    cookie_sec = process.env.secretCookie;
} else {
    cookie_sec = require("./secrets.json").secretCookie;
}

const {
    requireLoggedInUser,
    requireLoggedOutUser,
    setToken,
    dealWithCookieVulnerabilities,
} = require("./middleware");
const db = require("./db");
const bc = require("./bc");
const ses = require("./ses");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");

const { uploader } = require("./upload");
const s3 = require("./s3");

/////*****MIDDLEWARES*****/////
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use(setToken); // in prova
app.use(dealWithCookieVulnerabilities); // mi serve questo?

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/////*****WELCOME*****/////
app.get("/welcome", requireLoggedOutUser, (req, res) => {
    // if you don't have the cookie-session middelware this code will NOT work!
    if (req.session.userId) {
        // if the user is logged in... redirect away from /welcome
        res.redirect("/"); //app?
    } else {
        // user is not logged in... don't redirect!
        // what happens after sendfile, after we send our HTML back as a response,
        // is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

// app.post("/registration", async (req, res) => {
//     //console.log("req: ", req.body);
//     const firstName = req.body.first;
//     const lastName = req.body.last;
//     const email = req.body.email;
//     const password = req.body.password;
//     // const { first, last, email, password } = req.body;

//     bc.hash(password)
//         .then((hashedPw) => {
//             return db
//                 .userRegistration(firstName, lastName, email, hashedPw)
//                 .then((results) => {
//                     console.log("db.userRegistration had no issues!");
//                     req.session.userId = results.rows[0].id;
//                     res.json(results);
//                 })
//                 .catch((err) => {
//                     console.log("ERR in db.userRegistration: ", err);
//                     res.json({ error: true });
//                 });
//         })
//         .catch((err) => {
//             console.log("ERR in hash:", err);
//         });
// });

/////*****AUTH*****/////
app.post("/registration", async (req, res) => {
    const { first, last, email, password } = req.body;
    // you can only uses await on functions that return a promise!!!
    try {
        const hashedPw = await bc.hash(password);
        const results = await db.userRegistration(first, last, email, hashedPw);
        req.session.userId = results.rows[0].id;
        console.log("db.userRegistration had no issues!");
        res.json({ results });
    } catch (err) {
        console.log("err in POST /registration", err.message);
        console.log(err.code);
        if (err.message === 'relation "users" does not exist') {
            // send back an error specific response
            console.log('relation "users" does not exist');
            res.json({ error: true });
        } else if (err.code == "54301") {
            // send back an error specific response
            console.log("err.code: 54301");
            res.json({ error: true });
        }
        res.json({ error: true });
    }
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.checkUser(email)
        .then((results) => {
            const hashFromDB = results.rows[0].password;
            bc.compare(password, hashFromDB)
                .then((match) => {
                    if (match) {
                        req.session.userId = results.rows[0].id;
                        res.json(results);
                    } else {
                        console.log("ERR in bc.compare, infos not correct!!!");
                        res.json({ error: true });
                    }
                })
                .catch((err) => {
                    console.log("ERR in bc.compare: ", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("ERR in db.checkUser: ", err);
            res.json({ error: true });
        });
});

/////*****RESET PSW*****/////
app.post("/password/reset/start", (req, res) => {
    const email = req.body.email;

    db.checkUser(email)
        .then((results) => {
            console.log("results: ", results.rows[0].email);
            if (results.rows[0].email) {
                const code = cryptoRandomString({
                    length: 6,
                });
                db.storeCode(email, code)
                    .then(
                        ses
                            .sendEmail(
                                email,
                                code,
                                "Here is your reset password code"
                            )
                            .then(res.json({ codeSended: true }))
                            .catch((err) => {
                                console.log("ERR in ses.sendEmail: ", err);
                                res.json({ error: true });
                            })
                    )
                    .catch((err) => {
                        console.log("ERR in db.storeCode: ", err);
                        res.json({ error: true });
                        //questo errore non torna come render
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("ERR in db.checkUser (reset post req): ", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const password = req.body.password;
    const code = req.body.code;

    db.checkCode(code)
        .then((results) => {
            console.log("results: ", results.rows);
            const email = results.rows[0].email;
            bc.hash(password)
                .then((hashedPw) => {
                    db.updatePassword(email, hashedPw)
                        .then(
                            //capire come passare email da post precedente (per update psw) forse con results.rows
                            res.json({ pswUpdated: true })
                        )
                        .catch((err) => {
                            console.log("ERR in db.updatePassword: ", err);
                            res.json({ error: true });
                        });
                })
                .catch((err) => {
                    console.log("ERR in hash:", err);
                });
        })
        .catch((err) => {
            console.log("ERR in db.checkCode: ", err);
            res.json({ error: true });
        });
});

/////*****USER*****/////
app.get("/user", async (req, res) => {
    console.log("GET req to route /user");
    //code here?

    try {
        const { rows } = await db.getUser(req.session.userId);
        res.json(rows[0]);
    } catch (err) {
        console.log("ERR in db.getUser: ", err);
        res.json({ error: true });
    }
});

app.post(
    "/profile-pic",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        console.log("POST req to route /profile-pic");
        //code here?
        console.log("req.body: ", req.body);
        console.log("req.file: ", req.file);

        if (req.file) {
            const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

            try {
                const { rows } = await db.uploadProfileImage(
                    url,
                    req.session.userId
                );
                res.json(rows[0]);
            } catch (err) {
                console.log("err with db.uploadProfileImage: ", err);
                res.json({ error: true });
            }
        } else {
            console.log("No file in uploader!");
            res.json({ error: true });
        }
    }
);

app.post("/update-bio", async (req, res) => {
    console.log("POST req to route /update-bio");
    console.log("req.body: ", req.body);

    if (req.body.bio) {
        try {
            const { rows } = await db.updateBio(
                req.body.bio,
                req.session.userId
            );
            res.json(rows[0]);
        } catch (err) {
            console.log("err with db.updateBio: ", err);
            res.json({ error: true });
        }
    } else {
        console.log("No text in bio!");
        res.json({ error: true });
    }
});

/////*****OTHER USER*****/////
app.get("/api/other-profile/:id", async (req, res) => {
    //can also use "/user/:id.json" instead
    console.log("GET req to route /api/other-profile/:id");
    try {
        const { rows } = await db.getUser(req.params.id);
        if (rows.length) {
            res.json(rows[0]);
        } else {
            console.log("err with db.getUser (other user): no user found");
            res.json({ error: true });
        }
    } catch (err) {
        console.log("err with db.getUser (other user): ", err);
        res.json({ error: true });
    }
});

/////*****FIND USERS*****/////
app.get("/api/find-users/:name", async (req, res) => {
    console.log("GET req to route /api/find-users/:name");

    if (req.params.name === "pageload") {
        try {
            const { rows } = await db.findRecentUsers();
            console.log("rows (findRecentUsers): ", rows);
            res.json(rows);
        } catch (err) {
            console.log("err with db.findRecentUsers: ", err);
            res.json({ error: true });
        }
    } else {
        try {
            const { rows } = await db.findUser(req.params.name);
            console.log("rows (findRecentUsers): ", rows);
            res.json(rows);
        } catch (err) {
            console.log("err with db.findUser: ", err);
            res.json({ error: true });
        }
    }
});

/////*****FRIENDSHIP*****/////
app.get("/api/friendship/:id", async (req, res) => {
    console.log("GET req to route /api/friendship/:id");

    let userId = req.session.userId;
    let profileId = req.params.id;

    console.log("userId: ", userId, " - profileId: ", profileId);

    try {
        const { rows } = await db.friendStatus(userId, profileId);
        console.log("rows (friendStatus): ", rows);

        if (!rows.length) {
            res.json({ buttonText: "Send friendship request" });
        } else if (rows[0].accepted) {
            res.json({ buttonText: "End friendship" });
        } else if (!rows[0].accepted) {
            if (rows[0].sender_id == userId) {
                res.json({ buttonText: "Cancel friend request" });
            } else {
                res.json({ buttonText: "Accept friend request" });
            }
        }

        // if () {}
        //empty array = no amicizia = make friend request button
        //accepted: false = cancel friend request or the accept friend request button
        //accepted: true = end friendship
    } catch (err) {
        console.log("err with db.friendStatus: ", err);
        res.json({ error: true });
    }
});

app.post("/api/friendship/:id", async (req, res) => {
    console.log("POST req to route /api/friendship/:id");
    let userId = req.session.userId;
    let profileId = req.params.id;
    let status = req.body.buttonText;

    if (status == "Send friendship request") {
        try {
            const result = await db.requestFriendship(userId, profileId);
            res.json({
                buttonText: "Cancel friend request",
                profileId: result.recipient_id,
            });
        } catch (err) {
            console.log("err with db.requestFriendship: ", err);
            res.json({ error: true }); //mi serve qua?
        }
    } else if (status == "Cancel friend request") {
        try {
            const result = await db.deleteFriendshipRequest(userId, profileId);
            res.json({
                buttonText: "Send friendship request",
                profileId: result.recipient_id,
            });
        } catch (err) {
            console.log("err with db.deleteFriendshipRequest: ", err);
            res.json({ error: true });
        }
    } else if (status == "Accept friend request") {
        try {
            const result = await db.acceptFriendship(userId, profileId);
            res.json({
                buttonText: "End friendship",
                profileId: result.recipient_id,
            });
        } catch (err) {
            console.log("err with db.acceptFriendship: ", err);
            res.json({ error: true });
        }
    } else if (status == "End friendship") {
        try {
            const result = await db.deleteFriendshipRequest(userId, profileId);
            res.json({
                buttonText: "Send friendship request",
                profileId: result.recipient_id,
            });
        } catch (err) {
            console.log("err with db.deleteFriendshipRequest: ", err);
            res.json({ error: true });
        }
    }
});

/////*****FRIENDS LIST*****/////
app.get("/api/get-friends", async (req, res) => {
    try {
        const { rows } = await db.friendsList(req.session.userId);
        console.log("rows (friendsList): ", rows);
        res.json({ rows });
    } catch (err) {
        console.log("err with db.friendsList: ", err);
        res.json({ error: true });
    }
});

/////*****MORE*****/////
app.get("/logout", requireLoggedInUser, (req, res) => {
    req.session = null;
    res.redirect("/"); //welcome ?
});

app.get("*", requireLoggedInUser, (req, res) => {
    // if they are logged in, send over the HTML
    // and once the client has the HTML, start.js will render the <p> tag onscreen
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, () => {
    console.log("I'm listening.");
});

/*
BUG E STEPS NON COMPLETATI:
    0) Client ci mette almeno 20sec per partire --> risolto
    1) Ritornare vari errori per auth
    1.a)se email é gia in db non dare cookie in registration e non entrare nel sito
    1.b)se loggo con dati sbagliati devo avere un messaggio, invece vado a registration
    1.c)se do email non esistente per reset-password voglio un messaggio che dice che non esiste
    1.d) vari messaggi anche per registration
    2) Potrei cambiare la db.checkUser con db.getUser (avrebbe piu senso visto che la uso anche in reset psw) --> risolto
    3) Capire come funzionano sti url.. non mi sono chiari e non vorrei che cambiassero in modo cosí strano --> risolto
    4) Cosé binding method?
    5) Cosé export default? --> risolto
    6) default img non viene caricata in header fuori da route "/" --> risolto
    7) in molte parti "res.json({ error: true });" non sono sicuro serva veramente
    8) a cosa serve la cartella hooks?
    9) aggiungere home prima di profile?
    10) tests
    11) buttons per frindships non si aggiornano senza refresh (normale?)
    12) logout broken?
*/
