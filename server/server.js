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
const csurf = require("csurf");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
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
    //finire
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

app.get("*", function (req, res) {
    if (!req.session.userId) {
        // if the user is not logged in, redirect to /welcome
        res.redirect("/welcome");
    } else {
        // if they are logged in, send over the HTML
        // and once the client has the HTML, start.js will render the <p> tag onscreen
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
