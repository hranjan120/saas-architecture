const mongoose = require('mongoose');
const { Buffer } = require('buffer');
/*----------------*/
const appCommonDbConnObj = {};

exports.getDbConnection = (token) => {
  if (!token) return null;
  const base64Payload = token.split('.')[1];
  const jsonPayload = Buffer.from(base64Payload, 'base64');
  const tokenData = JSON.parse(jsonPayload);
  const dbName = tokenData.db;

  if (appCommonDbConnObj[dbName]) {
    //database connection already exist. Return connection object
    return appCommonDbConnObj[dbName];
  } else {
    try {
      const dbObj = mongoose.createConnection(`${process.env.DB_URL}/${dbName}?retryWrites=true&w=majority`);
      appCommonDbConnObj[dbName] = dbObj
      dbObj.on('open', (ref) => {
        console.log(dbName + ' - open connection to mongo server.');
      });
      dbObj.on('connected', (ref) => {
        console.log(dbName + ' - connected to mongo server.');
      });
      dbObj.on('disconnected', (ref) => {
        console.log(dbName + ' - disconnected from mongo server.');
      });
      dbObj.on('close', (ref) => {
        console.log(dbName + ' - close connection to mongo server');
      });
      dbObj.on('error', (err) => {
        console.log(dbName + ' - error connection to mongo server!');
        console.log(err);
      });
      return dbObj;
    } catch (errs) {
      console.log(errs);
      return null;
    }
  }
}