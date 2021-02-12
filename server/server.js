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

const db = require("./db");
const bc = require("./bc");
const ses = require("./ses");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use((req, res, next) => {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/welcome", (req, res) => {
    //req.session.userId = 1; //solo per test, eliminare
    // if you don't have the cookie-session middelware this code will NOT work!
    if (req.session.userId) {
        // if the user is logged in... redirect away from /welcome
        res.redirect("/");
    } else {
        // user is not logged in... don't redirect!
        // what happens after sendfile, after we send our HTML back as a response,
        // is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    //console.log("req: ", req.body);
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
    const password = req.body.password;

    bc.hash(password)
        .then((hashedPw) => {
            return db
                .userRegistration(firstName, lastName, email, hashedPw)
                .then((results) => {
                    console.log("db.userRegistration had no issues!");
                    req.session.userId = results.rows[0].id;
                    res.json(results);
                })
                .catch((err) => {
                    console.log("ERR in db.userRegistration: ", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("ERR in hash:", err);
        });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.userLogIn(email)
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
            console.log("ERR in db.userLogin: ", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/start", (req, res) => {
    const email = req.body.email;

    db.userLogIn(email)
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
            console.log("ERR in db.userLogIn (reset post req): ", err);
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

app.get("*", (req, res) => {
    if (!req.session.userId) {
        // if the user is not logged in, redirect to /welcome
        res.redirect("/welcome");
    } else {
        // if they are logged in, send over the HTML
        // and once the client has the HTML, start.js will render the <p> tag onscreen
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, () => {
    console.log("I'm listening.");
});

/*
BUG E STEPS NON COMPLETATI:
    1) Ritornare vari errori per auth
    1.a)se email é gia in db non dare cookie in registration e non entrare nel sito
    1.b)se loggo con dati sbagliati devo avere un messaggio, invece vado a registration
    1.c)se do email non esistente per reset-password voglio un messaggio che dice che non esiste
    1.d) vari messaggi anche per registration
    2) Potrei cambiare la db.userLogin con db.checkUser (avrebbe piu senso visto che la uso anche in reset psw)
    3) Capire come funzionano sti url.. non mi sono chiari e non vorrei che cambiassero in modo cosí strano

*/
