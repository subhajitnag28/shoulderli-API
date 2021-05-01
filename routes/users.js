const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const config = require("../config");
const { userService } = require("../services/index");
const { createToken } = require("../utils");
const authorization = require("../middleware/authorization");
const saltRounds = 9;

// user registration
router.post("/registration", (req, res) => {
    const requestBody = req.body,
        { name, email, phoneNumber, address, city, pincode, gender, dob, age, height, aadhaarNumber, highestQualification, password, funcArea, resume, acceptTermsAndCondition, userType } = requestBody;
    // check all fields or not
    if (name && email && phoneNumber && address && city && pincode && gender && dob && height && aadhaarNumber && highestQualification && password && funcArea && resume && acceptTermsAndCondition && userType) {
        const data = {
            name: name.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            address: address.trim(),
            city: city.trim(),
            pincode: pincode.trim(),
            gender,
            dob,
            age,
            height,
            aadhaarNumber,
            highestQualification,
            password: bcrypt.hashSync(password.trim(), saltRounds),
            funcArea,
            resume,
            acceptTermsAndCondition,
            userType,
            createdTimestamp: new Date().getTime(),
            modifiedTimestamp: new Date().getTime(),
            token: createToken(email, config.secret)
        };
        userService.registration(data).then((result) => {
            res.status(result.code).json({
                code: result.code,
                data: result.data,
                message: result.message
            });
        }).catch((error) => {
            res.status(error.code).json({
                code: error.code,
                message: error.message
            });
        });
    } else {
        res.status(404).json({
            code: 404,
            message: "Name, email, phone number, address, city, pincode, gender, date of birth, height, aadhaar number, highest qualification, password, functional area, Resume, terms & condition and user type are required"
        });
    }
});

// user login
router.post("/login", (req, res) => {
    const requestBody = req.body,
        { email, password } = requestBody;
    // check all fields or not
    if (email && password) {
        const data = {
            email: email.trim(),
            password: password.trim(),
        };
        userService.login(data).then((result) => {
            res.status(result.code).json({
                code: result.code,
                data: result.data,
                message: result.message
            });
        }).catch((error) => {
            res.status(error.code).json({
                code: error.code,
                message: error.message
            });
        });
    } else {
        res.status(404).json({
            code: 404,
            message: "Email and password are required"
        });
    }
});

// get user details
router.post("/user-details", authorization, (req, res) => {
    const requestBody = req.body,
        { email } = requestBody;
    if (email) {
        const data = {
            email
        };
        userService.userDetails(data).then((result) => {
            res.status(result.code).json({
                code: result.code,
                data: result.data,
                message: result.message
            });
        }).catch((error) => {
            res.status(error.code).json({
                code: error.code,
                message: error.message
            });
        });
    } else {
        res.status(404).json({
            code: 404,
            message: "Email is required"
        });
    }
});

// user lists with specific user type
router.get("/user-lists/:userType", authorization, (req, res) => {
    const requestBody = req.params,
        { userType } = requestBody;
    if (userType) {
        userService.userLists(userType).then((result) => {
            res.status(result.code).json({
                code: result.code,
                data: result.data,
                message: result.message
            });
        }).catch((error) => {
            res.status(error.code).json({
                code: error.code,
                message: error.message
            });
        });
    } else {
        res.status(404).json({
            code: 404,
            message: "User type is required"
        });
    }
});

//serach users with criteria
router.post("/search-users", authorization, (req, res) => {
    const requestBody = req.body,
        { fromAge, toAge, gender, height } = requestBody;
    const data = {
        fromAge,
        toAge,
        gender,
        height
    };
    userService.searchUsers(data).then((result) => {
        res.status(result.code).json({
            code: result.code,
            data: result.data,
            message: result.message
        });
    }).catch((error) => {
        res.status(error.code).json({
            code: error.code,
            message: error.message
        });
    });
});

module.exports = router;