const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

// USER REGISTRATION & LOGIN
module.exports.userRegistration = (firstName, lastName, email, hashedPw) => {
    const myQuery = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const keys = [firstName, lastName, email, hashedPw];
    return db.query(myQuery, keys);
};

module.exports.checkUser = (email) => {
    const myQuery = `SELECT * FROM users WHERE email = $1`;
    const key = [email];
    return db.query(myQuery, key);
};

// RESET PASSWORD
module.exports.storeCode = (email, code) => {
    const myQuery = `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING id`;
    const keys = [email, code];
    return db.query(myQuery, keys);
};

module.exports.checkCode = (code) => {
    const myQuery = `SELECT * FROM reset_codes
    WHERE code = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const key = [code];
    return db.query(myQuery, key);
};

module.exports.updatePassword = (email, password) => {
    const myQuery = `UPDATE users SET password = $2 WHERE email = $1`;
    const keys = [email, password];
    return db.query(myQuery, keys);
};

// PROFILE
module.exports.getUser = (id) => {
    const myQuery = `SELECT * FROM users WHERE id = $1`;
    const key = [id];
    return db.query(myQuery, key);
};

module.exports.uploadProfileImage = (url, id) => {
    const q = `UPDATE users SET profile_pic_url = $1 WHERE id = $2 RETURNING profile_pic_url`; //senza returnin non vedo l'immagine appena la carico, ma solo se ricarico la pagin
    const keys = [url, id];
    return db.query(q, keys);
};

module.exports.updateBio = (bio, id) => {
    const q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio`;
    const keys = [bio, id];
    return db.query(q, keys);
};

// FIND USERS
module.exports.findRecentsUsers = () => {
    const myQuery = `SELECT * FROM users ORDER BY id DESC LIMIT 3;`;
    return db.query(myQuery);
};
