const { getNamespace } = require('cls-hooked');

const { initMasterDbConnection } = require('./masterDbConnect');
const { initTenantDbConnection } = require('./tenantDbConnect');
const { getAllTenants } = require('./clientDbService');

let tenantDbconnectionMap;
let adminDbConnection;
/*
*
*/
const connectAllDb = async () => {
    let tenants = [];

    adminDbConnection = await initMasterDbConnection();

    // console.log('Connect All Master DB Called');
    try {
        tenants = await getAllTenants(adminDbConnection);
        console.log('Connect All DB tenants');
    } catch (e) {
        console.log('connectAllDb error', e);
        return;
    }

    if (tenants.length > 0) {
        tenantDbconnectionMap = tenants
            .map((tenant) => ({
                [tenant.tenantDbName]: initTenantDbConnection(`${process.env.BASE_DB_URI}/${tenant.tenantDbName}?retryWrites=true&w=majority`),
            }))
            .reduce((prev, next) => ({ ...prev, ...next }), {});

        console.log('Connect All Tenant DB Map Called');
    }
};

/**
 * Get the tenant connection
 */
const getConnectionByTenant = (tenantName) => {
    if (tenantDbconnectionMap) {
        return tenantDbconnectionMap[tenantName];
    }
    return null;
};

/**
 * Get the master db connection.
 */
const getMasterConnection = () => {
    if (adminDbConnection) {
        console.log('Getting adminDbConnection');
        return adminDbConnection;
    }
    return null;
};

/*
*
*/
const getConnection = () => {
    const nameSpace = getNamespace('saas_app_unique_context');
    const conn = nameSpace.get('connection');
    if (conn) {
        return conn;
    }
    console.log('The provided Client is not available');
    return null;
};

/*-------------------*/
module.exports = {
    connectAllDb,
    getMasterConnection,
    getConnection,
    getConnectionByTenant,
};
