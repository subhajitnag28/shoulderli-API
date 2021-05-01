const jwt = require('jsonwebtoken');

// create jwt token
const createToken = (email, secret) => {
    return jwt.sign({
        data: email
    }, secret, { expiresIn: 100000000 * 24 * 3600 });
};

// verify token
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                reject({ code: 500, message: "Failed to authenticate token" })
            } else {
                const data = {
                    email: decoded.data,
                    exp: decoded.exp
                };
                resolve({ code: 200, data, message: "Token authenticated" })
            }
        });
    });
};

module.exports = { createToken, verifyToken };