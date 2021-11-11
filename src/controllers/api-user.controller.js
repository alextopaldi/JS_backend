const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const Token = require('../database/models/Token.model');
const User = require('../database/models/User.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/user', asyncHandler(requireToken), asyncHandler(getUser));
    router.patch('/user', asyncHandler(requireToken), asyncHandler(updateUser));
    router.post('/out', asyncHandler(requireToken), asyncHandler(outUser));
}

async function getUser(req, res, next) {
    const info = await User.findByPk(req.userId);
    if (!info){
        throw new ErrorResponse("User is not found", 400)
    }
    res.status(200).json({
        info
    })
}

async function updateUser(req, res, next) {
    const user = await User.findByPk(req.userId);

    if(!user) {
        throw ErrorResponse("User is not found", 404)
    }

    await user.update({
        ...req.body
    })
    res.status(200).json(user)
}

async function outUser(req, res, next) {
    const token = await Token.destroy({
        where: {
            value: req.header('x-access-token')
        }
    })
    res.status(200).json({message: "User deleted"})
}
initRoutes();

module.exports = router;