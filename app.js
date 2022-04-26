require('dotenv').config();
const express = require('express');


/*
*-------------------------Include routes----------------------
*/
const userRoutes = require('./routes/userRoutes');


/*
*---------------------Middleware section-------------------
*/
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Channel');
  next();
});
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/** *******************************************************************
*
*-------------------------Use Routes middleware----------------------
*
********************************************************************* */
app.get('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'];
    res.status(200).json({
      statusCode: 'OK', statusValue: 200, message: 'Message from index', payload: { ipAddress: ip },
    });
  } catch (err) {
    res.status(500).json({ statusCode: 'ERROR', statusValue: 500, messages: `The Server was unable to complete your request. ${err}` });
  }
});

/*---------------------------------------------*/
app.use('/v1/user', userRoutes);

/*--------------------------------------------*/
app.get('*', async (req, res) => {
  const ip = req.headers['x-forwarded-for'];
  res.status(404).json({
    statusCode: 'FAIL', statusValue: 404, message: 'Requested url is not available..', ipAddress: ip,
  });
});

/*
  *----------------------------------------------------------------------------
  */
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`App is on: ${app.get('env')} Mode`);
});
