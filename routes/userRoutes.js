//
//	ROUTER FOR USERS
//

//THIRD PARTY MODULES
const express = require('express');

//PERSONAL MODULES
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = userRouter;
