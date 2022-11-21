const Joi = require('joi');

const { getConnection } = require('../connection/connectionManager');

const userService = require('../services/userService');
/*
*-----------------------------Routes Section------------------------
*/
exports.getAllUsers = async (req, res, next) => {
    try {
        const dbConnection = await getConnection();
        if (!dbConnection) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'The Tenant is not available' });
        }
        const userData = await userService.getAllUsers(dbConnection);

        return res.status(200).json({
            statusCode: 'OK', statusValue: 200, message: 'All user Data', payload: { userData },
        });
    } catch (err) {
        return next(err);
    }
};

/*--------------------*/
exports.addSingleUser = async (req, res, next) => {
    try {
        const schema = Joi.object({
            userName: Joi.string().label('User Name'),
            userEmail: Joi.string().required().label('User Email'),
            userPhone: Joi.string().required().label('User Phone'),
            userPassword: Joi.string().required().label('User Password'),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: result.error.details[0].message });
        }

        const dbConnection = await getConnection();
        if (!dbConnection) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'The Tenant is not available' });
        }

        await userService.insertUserData(dbConnection, req.body);

        return res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'New User created Successfully' });
    } catch (err) {
        return next(err);
    }
};
