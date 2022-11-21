require('dotenv').config();

const { connectAllDb } = require('./connection/connectionManager');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

/* ******************************************************************
*---------------------------mongodb connection----------------------
******************************************************************* */
(async () => {
    await connectAllDb();
})();

/*
*----------------------------------------------------------------------
*/
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App Server started on port ${port}`);
    console.log(`App is on: ${app.get('env')} Mode`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    process.exit(1);
});
