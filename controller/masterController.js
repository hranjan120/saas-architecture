const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const { getMasterConnection } = require('../connection/connectionManager');

const dataValidation = require('../common/dataValidation');

const tenantService = require('../services/tenantService');
/*
*-----------------------------Routes Section------------------------
*/
exports.addNewTenant = async (req, res, next) => {
    try {
        const schema = Joi.object({
            tenantName: Joi.string().label('Tenant Name'),
            tenantId: Joi.string().required().label('Tenant Id'),
            tenantDbName: Joi.string().required().label('Tenant DB Name'),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: result.error.details[0].message });
        }

        const dbConnection = getMasterConnection();
        if (!dbConnection) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'The Master is not available' });
        }

        await tenantService.insertTenantData(dbConnection, req.body);

        return res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'New Tenant created Successfully' });
    } catch (err) {
        return next(err);
    }
};

/*--------------------*/
exports.getAllTenant = async (req, res, next) => {
    try {
        const dbConnection = getMasterConnection();
        if (!dbConnection) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'The Master is not available' });
        }

        const tenantData = await tenantService.getAllTenant(dbConnection);

        return res.status(200).json({
            statusCode: 'OK', statusValue: 200, message: 'All tenant Data', payload: { tenantData },
        });
    } catch (err) {
        return next(err);
    }
};

/*--------------------*/
exports.getTenantIdentity = async (req, res, next) => {
    try {
        const dbConnection = getMasterConnection();
        if (!dbConnection) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'The Master is not available' });
        }

        const userUrl = req.headers.referer || req.headers.origin || 'tenant.one';
        if (!userUrl) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'Unable to find Client' });
        }

        let url = userUrl;
        url = url.replace('https://www.', '');
        url = url.replace('http://www.', '');
        url = url.replace('https://', '');
        url = url.replace('http://', '');
        url = url.replace(`.${config.get('clientUrl')}`, '');
        const temp = url.split('/');
        if (temp.length === 0) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'Unable to find Tenant.' });
        }
        console.log(temp);
        if (temp[0] === config.get('clientUrl')) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'Unable to find Tenant..' });
        }

        const clientData = await tenantService.fetchTenantBySubdomain(dbConnection, temp[0]);
        if (!clientData) {
            return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'Unable to find Tenant data' });
        }

        const clientDb = dataValidation.encryptString(clientData.tenantDbName);

        const token = jwt.sign({
            userEmail: 'NA', userFullName: 'NA', uid: '616ec293fa6dc91e2122b84d', did: clientDb,
        }, config.get('authConfig.userKey'), { expiresIn: 2592000 });

        return res.status(200).json({
            statusCode: 'OK',
            statusValue: 200,
            message: 'Tenant Identity',
            payload: {
                token,
            },
        });
    } catch (err) {
        return next(err);
    }
};
