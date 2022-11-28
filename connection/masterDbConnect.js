const mongoose = require('mongoose');

const { tenantMasterModel } = require('../schema/master/tenantMasterModel');

/*
*
*/
const initMasterDbConnection = async () => new Promise((resolve) => {
    const dbConnObj = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 30000,
        keepAlive: true,
        maxPoolSize: 10,
        retryWrites: false,
    };
    const DB_URL = `${process.env.MASTER_DB_URL}`;
    mongoose.connect(DB_URL, dbConnObj).then((dbConn) => {
        console.log('Master DB connected Successfully');
        tenantMasterModel(dbConn);
        resolve(dbConn);
    }).catch((error) => {
        console.log('init Master Db Connection error', error);
    });
});

module.exports = {
    initMasterDbConnection,
};
