const jwt = require('jsonwebtoken');

const userSchema = require('../models/userSchema');

const { getDbConnection } = require('../connectionResolver');
/*
*-------------------Routes Section---------------------
*/
exports.getUser = async (req, res) => {
    try {
        const userDb = getDbConnection(req.headers.authorization);
        const userTable = userSchema(userDb);
        
        const userList = await userTable.find();

        res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'Get User', userList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to Process your request' });
    }
  };

  //------------------------
  exports.addUser = async (req, res) => {
    try {
        if(!req.body.userFullName || !req.body.userEmail || !req.body.userPwd)
        return res.status(400).json({ statusCode: 'ERROR', statusValue: 400, message: 'Provide valid data' });

        const userDb = getDbConnection('org_two_db');
        const userTable = userSchema(userDb);
        const newUser = new userTable(req.body);
        await newUser.save();

        res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'User Added Successfully' });
    } catch (err) {
        res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to Process your request' });
    }
  };

  //------------------------
  exports.loginUser = async (req, res) => {
    try {
        if(!req.body.userEmail || !req.body.userPwd)
        return res.status(400).json({ statusCode: 'ERROR', statusValue: 400, message: 'Provide valid data' });

        const userDbName = 'org_one_db';

        const userDb = getDbConnection(userDbName);
        const userTable = userSchema(userDb);
        
        const userData = await userTable.findOne({ userEmail: req.body.userEmail, userPwd: req.body.userPwd });
        if(!userData) return res.status(400).json({ statusCode: 'ERROR', statusValue: 400, message: 'No user found' });

        const userToken = jwt.sign({
            email: userData.userEmail, uid: userData._id, name: userData.userFullName, db: userDbName
          }, 'dfghjk45678dscdshc@hvh', { expiresIn: 2592000 });

        res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'Login Success', userToken });
    } catch (err) {
        res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to Process your request' });
    }
  };