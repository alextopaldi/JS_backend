const Token = require('../database/models/Token.model');

const ErrorResponse = require("../classes/error-response.js");

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const syncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const requireToken = async (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) {
        throw new ErrorResponse("Sent error", 404)
    }

    const exToken = await Token.findOne({
        where: {value : token}
    })
    if (!exToken){
        throw new ErrorResponse("Incorrect token", 404)
    }
    req.userId = exToken.userId

    next()
}

const notFound = (req, _res, next) => {
    next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
    console.log('Ошибка', {
        message: err.message,
        stack: err.stack,
    });
    res.status(err.code || 500).json({
        message: err.message
    });
};

module.exports = {
    asyncHandler,
    syncHandler,
    notFound,
    errorHandler,
    requireToken
};