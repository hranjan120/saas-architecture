const express = require('express');

const router = express.Router();
const { resolveTenant } = require('../connection/connectionResolver');
const userController = require('../controller/userController');
/*
*-----------------------------Routes Section------------------------
*/

router.get('/v1/get-all-users', resolveTenant, userController.getAllUsers);
router.post('/v1/add-single-user', resolveTenant, userController.addSingleUser);

/*
*-----------------------------
*/
module.exports = router;
