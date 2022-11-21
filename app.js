require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const path = require('path');
const helmet = require('helmet');

/*
*-------------------------Include routes----------------------
*/
const masterRoutes = require('./routes/masterRoutes');
const userRoutes = require('./routes/userRoutes');

/*
*---------------------Middleware section-------------------
*/
const app = express();
app.enable('trust proxy');
app.use(helmet());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ********************************************************************
*-------------------------Use Routes middleware----------------------
********************************************************************* */
app.get('/', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || '🤐';
        res.status(200).json({
            statusCode: 'OK', statusValue: 200, message: '👋 Hello by SAAS Demo App 😐', payload: { ipAddress: ip },
        });
    } catch (err) {
        res.status(500).json({ statusCode: 'ERROR', statusValue: 500, messages: 'The Server was unable to complete your request' });
    }
});

/*------------------------------------------*/
app.use('/master', masterRoutes);
app.use('/user', userRoutes);

/*--------------------------------------------*/
app.all('*', async (req, res) => {
    const ip = req.headers['x-forwarded-for'];
    res.status(404).json({
        statusCode: 'FAIL', statusValue: 404, message: 'Requested url is not available..', ipAddress: ip,
    });
});

app.use((err, req, res, next) => {
    console.log(typeof next);
    console.error(err.stack);
    res.status(err.status || 500).json({
        statusCode: 'ERROR', statusValue: err.status || 500, message: err.errMsg || 'Unable to Process your request',
    });
});

/*
*--------------------------------------------------
*/

module.exports = app;
