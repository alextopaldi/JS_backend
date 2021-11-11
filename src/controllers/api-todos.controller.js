const { Router } = require('express');
const ToDo = require('../dataBase/models/ToDo.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');
const ErrorResponse = require('../classes/error-response');

const router = Router();

function initRoutes() {
    router.get('/', asyncHandler(requireToken), asyncHandler(getToDos));
    router.get('/:id', asyncHandler(requireToken), asyncHandler(getToDoById));
    router.post('/', asyncHandler(requireToken), asyncHandler(createToDo));
    router.delete('/', asyncHandler(requireToken), asyncHandler(deleteToDos));
    router.delete('/:id', asyncHandler(requireToken), asyncHandler(deleteToDoById));
    router.patch('/:id', asyncHandler(requireToken), asyncHandler(patchToDo));
}

async function getToDos(req, res, next) {
    const todos = await ToDo.findAll({
        userId: req.userId
    });
    res.status(200).json({ todos });
}

async function getToDoById(req, res, next) {
    const todo = await ToDo.findOne({
        where: {
            id: req.params.id,
            userId: req.userId
        }
    });
    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }
    res.status(200).json(todo);
}

async function createToDo(req, res, next) {
    const todo = await ToDo.create({
        title: req.body.title,
        description: req.body.description,
        userId: req.userId
      })
    res.status(200).json(todo);
}

async function deleteToDos(req, res, next) {
    const todo = await ToDo.findOne({
        userId: req.userId
    })
    await ToDo.destroy({truncate: true})
    res.status(200).json(ToDo);
}
async function deleteToDoById(req, res, next) {
    const todo = await ToDo.findOne({
        where: {
            id: req.params.id,
            userId: req.userId
        }
    });
    if (!todo){ throw new ErrorResponse('ToDo not found', 404)}
    await todo.destroy();
    res.status(200).json({message: "OK"});
}

async function patchToDo(req, res, next) {

    const todo = await ToDo.findOne({
        where: {
            id: req.params.id,
            userId: req.userId
        }
    });

    if (!todo){ throw new ErrorResponse('ToDo not found', 404)}
    const id = req.params.id;
    await todo.update(req.body);
    res.status(200).json(todo);
}

initRoutes();

module.exports = router;