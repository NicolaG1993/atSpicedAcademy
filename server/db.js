const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

// USER REGISTRATION & LOGIN
module.exports.userRegistration = (firstName, lastName, email, hashedPw) => {
    const myQuery = `INSERT INTO users ("First Name", "Last Name", email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const keys = [firstName, lastName, email, hashedPw];
    return db.query(myQuery, keys);
};

module.exports.userLogIn = (email) => {
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
