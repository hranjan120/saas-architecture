const express = require('express');

const router = express.Router();

const masterController = require('../controller/masterController');
/*
*-----------------------------Routes Section------------------------
*/

router.post('/v1/add-new-tenant', masterController.addNewTenant);
router.get('/v1/get-all-tenant', masterController.getAllTenant);
router.get('/v1/get-tenant-identity', masterController.getTenantIdentity);

/*
*-----------------------------
*/
module.exports = router;
