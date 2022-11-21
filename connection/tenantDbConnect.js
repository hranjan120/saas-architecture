/* eslint-disable consistent-return */
const mongoose = require('mongoose');

const { allUserModel } = require('../schema/tenant/allUserModel');

/*
*
*/
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open');
});
mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log(
            'Mongoose default connection disconnected through app termination',
        );
        process.exit(0);
    });
});

/*
*
*/

const initTenantDbConnection = async (DB_URL) => {
    try {
        const dbConnObj = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            maxPoolSize: 1,
            retryWrites: false,
        };
        const dbConn = mongoose.createConnection(DB_URL, dbConnObj);
        // Include all your Schema Here

        allUserModel(dbConn);

        return dbConn;
    } catch (error) {
        console.log('init Tenant Db Connection error', error);
    }
};

module.exports = {
    initTenantDbConnection,
};
