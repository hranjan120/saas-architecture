/* eslint-disable consistent-return */
const { createNamespace } = require('cls-hooked');

const { getConnectionByTenant, getMasterConnection } = require('./connectionManager');
const { decryptString } = require('../common/dataValidation');
// Create a namespace for the application.
const nameSpace = createNamespace('saas_app_unique_context');
/**
 * Get the connection instance for the given tenant's name and set it to the current context.
 */
const parseJwt = (token) => {
    try {
        if (!token || token === 'undefined' || token === 'null' || token.length < 20) {
            return false;
        }
        const tokenArr = token.split('.');
        if (tokenArr.length !== 3) {
            return false;
        }
        const base64Payload = tokenArr[1];
        const jsonPayload = Buffer.from(base64Payload, 'base64');
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.log(err);
        return false;
    }
};

const resolveTenant = (req, res, next) => {
    let tenantIdentity = null;
    if (req.headers.authorization) {
        const decodedjwt = parseJwt(req.headers.authorization);
        if (decodedjwt && decodedjwt.did) {
            tenantIdentity = decryptString(decodedjwt.did);
        } else {
            tenantIdentity = null;
        }
    } else {
        return res.status(403).json({ statusText: 'FAIL', statusValue: 403, message: 'Please provide auth Token' });
    }
    if (!tenantIdentity) {
        return res.status(400).json({ statusText: 'FAIL', statusValue: 400, message: 'Please provide tenant name to connect' });
    }
    const dbString = tenantIdentity;
    // Run the application in the defined namespace.
    nameSpace.run(() => {
        const tenantDbConnection = getConnectionByTenant(dbString);

        nameSpace.set('connection', tenantDbConnection);
        next();
    });
};

/**
 * Get the admin db connection instance and set it to the current context.
 */
const setAdminDb = (req, res, next) => {
    // Run the application in the defined namespace.
    nameSpace.run(() => {
        const adminDbConnection = getMasterConnection();

        nameSpace.set('connection', adminDbConnection);
        next();
    });
};

module.exports = { resolveTenant, setAdminDb };
