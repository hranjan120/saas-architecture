const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
/*
*-----------------------------Routes Section------------------------
*/
router.get('/get-user', userController.getUser);
router.post('/add-user', userController.addUser);
router.post('/login-user', userController.loginUser);

/*
*-----------------------------
*/
module.exports = router;