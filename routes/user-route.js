const express = require('express');

const router = express.Router();

const userController = require('../controllers/user-controller');

router.post('/registration', userController.signupUser);

router.post('/login', userController.loginUser);

module.exports = router;