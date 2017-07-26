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
    passport = require("passport"),
    helmet = require("helmet"),
    compression = require("compression"),
    types_card = ["credit", "normal", "orther"];

global.errorHandler = (response, errorCode, errorMessage) => {
    return response.send({
        errorCode,
        errorMessage
    })
}
global.successHandler = (response, successCode, successData) => {
    return response.send({
        successCode,
        successData
    })
}
global.isEmpty = (value) => {
    if (value == null || 
        value == "null" || 
        value == "" || 
        value == undefined || 
        value == "undefined"
    ) return true;

    return false;
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
    cookieParser,
    helmet,
    compression,
    types_card
}