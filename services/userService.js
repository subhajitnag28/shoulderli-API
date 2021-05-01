const bcrypt = require('bcryptjs');
const dbConnection = require("../dbConnection");
const config = require("../config");

// check email exist
const checkEmailExist = (user, { email }) => {
    return new Promise((resolve, reject) => {
        user.find({ email }).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                return result.length !== 0 ? resolve(true) : resolve(false);
            }
        });
    });
};

// check phone number exist
const checkPhoneNumberExist = (user, { phoneNumber }) => {
    return new Promise((resolve, reject) => {
        user.find({ phoneNumber }).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                return result.length !== 0 ? resolve(true) : resolve(false);
            }
        });
    });
};

// check aadhaar card exist
const checkAadhaarExist = (user, { aadhaarNumber }) => {
    return new Promise((resolve, reject) => {
        user.find({ aadhaarNumber }).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                return result.length !== 0 ? resolve(true) : resolve(false);
            }
        });
    });
};

// user registration
const registration = (data) => {
    return new Promise(async (resolve, reject) => {
        const user = dbConnection.db(config.dbName).collection('user');
        try {
            const isEmailExist = await checkEmailExist(user, data);
            if (!isEmailExist) {
                try {
                    const isPhoneNumberExist = await checkPhoneNumberExist(user, data);
                    if (!isPhoneNumberExist) {
                        try {
                            const isAadhaarExist = await checkAadhaarExist(user, data);
                            if (!isAadhaarExist) {
                                user.insertOne(data, (error, result) => {
                                    if (error) {
                                        reject({ code: 500, message: "Internal server error" });
                                    } else {
                                        if (result.ops.length != 0) {
                                            resolve({ code: 200, data: result.ops[0].token, message: "User registration successfully, please login to continue" });
                                        } else {
                                            reject({ code: 404, message: "Something went wrong" });
                                        }
                                    }
                                });
                            } else {
                                reject({ code: 404, message: "Aadhaar number already exist" });
                            }
                        } catch (err) {
                            reject({ code: 500, message: "Internal server error" });
                        }
                    } else {
                        reject({ code: 404, message: "Phone number already exist" });
                    }
                } catch (error) {
                    reject({ code: 500, message: "Internal server error" });
                }
            } else {
                reject({ code: 404, message: "Email already exist" });
            }
        } catch (error1) {
            reject({ code: 500, message: "Internal server error" });
        }
    });
};

// user login
const login = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        const user = dbConnection.db(config.dbName).collection('user');
        user.find({ email }).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                if (result.length !== 0) {
                    const passwordHash = result[0].password,
                        match = bcrypt.compareSync(password, passwordHash);
                    if (match) {
                        resolve({ code: 200, data: result, message: "User details" });
                    } else {
                        reject({ code: 404, message: "Password is incorrect, please provide the correct password" });
                    }
                } else {
                    reject({ code: 404, message: "User not exist" });
                }
            }
        });
    });
};

//get user details
const userDetails = ({ email }) => {
    return new Promise(async (resolve, reject) => {
        const user = dbConnection.db(config.dbName).collection('user');
        user.find({ email }).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                resolve({ code: 200, data: result.length !== 0 ? result : [], message: "User details" })
            }
        });
    });
};

//user lists with specific user type
const userLists = () => {
    return new Promise(async (resolve, reject) => {
        const user = dbConnection.db(config.dbName).collection('user');
        user.find({ "userType": { $in: ['employee'] } }).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                resolve({ code: 200, data: result.length !== 0 ? result : [], message: "User lists" })
            }
        });
    });
};

//search users
const searchUsers = (data) => {
    return new Promise(async (resolve, reject) => {
        const { fromAge, toAge, gender, height } = data;
        let condition = {};
        if (fromAge === "" && toAge === "" && gender === "" && height === "") {
            condition = { "userType": { $ne: "superAdmin" } };
        } else {
            if (fromAge !== "" && toAge !== "" && gender !== "" && height !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge), $lte: Number(toAge) },
                        },
                        {
                            "gender": gender
                        },
                        {
                            "height": { $gte: height },
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge), $lte: Number(toAge) }, "gender": gender, "height": { $gte: height }, };
            } else if (fromAge !== "" && toAge !== "" && gender !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge), $lte: Number(toAge) },
                        },
                        {
                            "gender": gender
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge), $lte: Number(toAge) }, "gender": gender };
            } else if (fromAge !== "" && toAge !== "" && height !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge), $lte: Number(toAge) },
                        },
                        {
                            "height": { $gte: height },
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge), $lte: Number(toAge) }, "height": { $gte: height }, };
            } else if (fromAge !== "" && gender !== "" && height !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge) },
                        },
                        {
                            "gender": gender,
                        },
                        {
                            "height": { $gte: height },
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge) }, "gender": gender, "height": { $gte: height }, };
            } else if (fromAge !== "" && toAge !== "") {
                condition = { "age": { $gte: Number(fromAge), $lte: Number(toAge) }, };
            } else if (fromAge !== "" && gender !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge), },
                        },
                        {
                            "gender": gender,
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge), }, "gender": gender, };
            } else if (fromAge !== "" && height !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge), },
                        },
                        {
                            "height": { $gte: height },
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge), }, "height": { $gte: height }, };
            } else if (gender !== "" && height !== "") {
                condition = {
                    $and: [
                        {
                            "gender": gender,
                        },
                        {
                            "height": { $gte: height },
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "gender": gender, "height": { $gte: height }, };
            } else if (fromAge !== "") {
                condition = {
                    $and: [
                        {
                            "age": { $gte: Number(fromAge), }
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "age": { $gte: Number(fromAge), }, };
            } else if (gender !== "") {
                condition = {
                    $and: [
                        {
                            "gender": gender,
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "gender": gender, };
            } else if (height !== "") {
                condition = {
                    $and: [
                        {
                            "height": { $gte: height },
                        },
                        {
                            "userType": { $ne: "superAdmin" }
                        }
                    ]
                }
                // condition = { "height": { $gte: height }, };
            } else {
                condition = { "userType": { $ne: "superAdmin" } };
            }
        }
        const user = dbConnection.db(config.dbName).collection('user');
        user.find(condition).toArray((error, result) => {
            if (error) {
                reject({ code: 500, message: "Internal server error" });
            } else {
                resolve({ code: 200, data: result.length !== 0 ? result : [], message: "User lists" })
            }
        });
    });
}

module.exports = { registration, login, userDetails, userLists, searchUsers };