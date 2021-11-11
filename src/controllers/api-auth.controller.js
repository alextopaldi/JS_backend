const { Router } = require('express');
const User = require('../dataBase/models/User.model');
const { asyncHandler } = require('../middlewares/middlewares');
const ErrorResponse = require('../classes/error-response');
const Token = require('../database/models/Token.model');
const {nanoid} = require('nanoid')

const router = Router();

function initRoutes() {
    router.post('/registration',asyncHandler(registration));
    router.post('/login',asyncHandler(login));
}

async function registration(req, res, next) {
    const isUser = await User.findOne({
        where : {
            login: req.body.login
        }
    })
    if (isUser) {
        throw new ErrorResponse('User is already registered', 400)
    }
    const newUser = await User.create(req.body)
    res.status(200).json({
        newUser
    });
}

async function login(req, res, next) {
    const foundUser = User.findOne({
        where : req.body
    })
    if (!foundUser) {
        throw new ErrorResponse('Incorrect data', 401)
    }
    const newToken = await Token.create({
        userId: foundUser.id,
        value: nanoid(128)
        
    });
    res.status(200).json({ accessToken: newToken.value })
}

initRoutes();

module.exports = router;