const { verifyToken } = require("../utils");
const config = require("../config");

const authorization = async (req, res, next) => {
    const token = req.headers['token'];
    if (token && token !== null) {
        verifyToken(token, config.secret).then((result) => {
            const { exp } = result.data;
            const currrentTime = Number(new Date().getTime().toString().slice(0, 10));
            if (currrentTime > exp) {
                res.status(500).json({
                    success: false,
                    message: "Token session expire, please login again"
                });
            } else {
                next();
            }
        }).catch((error) => {
            res.status(error.code).json({
                success: false,
                message: error.message
            });
        });
    } else {
        res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }
};
module.exports = authorization;