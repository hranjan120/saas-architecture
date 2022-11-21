/*
*
*/
exports.insertUserData = async (dbConn, bodyData) => {
    const UserTable = await dbConn.model('all_user_datas');

    const newData = new UserTable({
        userName: bodyData.userName,
        userEmail: bodyData.userEmail.toLowerCase(),
        userPhone: bodyData.userPhone || 'NA',
        userPassword: bodyData.userPassword,
    });

    await newData.save();
    return true;
};

/*--------------*/
exports.getAllUsers = async (dbConn) => {
    const UserTable = await dbConn.model('all_user_datas');

    const userData = UserTable.find().sort({ createdAt: -1 });
    return userData;
};
