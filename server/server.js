const express = require("express");
const app = express();

const cookieSession = require("cookie-session");
let cookie_sec;
if (process.env.secretCookie) {
    cookie_sec = process.env.secretCookie;
} else {
    cookie_sec = require("./secrets.json").secretCookie;
}

const compression = require("compression");
const path = require("path");

const db = require("./db");
const bc = require("./bc");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: cookie_sec,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.get("/welcome", (req, res) => {
    req.session.userId = 1; //solo per test, eliminare
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
    console.log("req.body: ", req.body);

    bc.hash(req.body.password)
        .then((hashedPw) => {if (
            firstName == "" ||
            lastName == "" ||
            email == "" ||
            password == ""
        ) {
            throw Error;
        } else db.})
        .catch();
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
