let express = require("express"),
    app = express(),
    router = express.Router(),
    morgan = require("morgan"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    session = require('client-sessions'),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    bcrypt = require("bcryptjs"),
    uuid = require("uuid"),
    passport = require("passport");

global.errorHandler = (res, errorCode, errorMessage) => {
    return res.send({
        errorCode,
        errorMessage
    })
}
global.successHandler = (res, successCode, successData) => {
    return res.send({
        successCode,
        successData
    })
}
global.variables = {
    app,
    router,
    cors,
    bodyParser,
    morgan,
    mongoose,
    bcrypt,
    uuid,
    passport,
    session,
    cookieParser
}