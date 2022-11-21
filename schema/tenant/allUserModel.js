const mongoose = require('mongoose');

const { Schema } = mongoose;

const allUserModel = async (dbconn) => {
    const allUser = new Schema({
        userName: { type: String, required: true },
        userEmail: { type: String, unique: true, required: true },
        userPhone: { type: String, default: 'NA' },
        userPassword: { type: String, required: true },
        userStatus: { type: String, enum: ['1', '2'], default: '1' },
    }, {
        timestamps: true,
    });
    allUser.index({ userEmail: 1 });
    dbconn.model('all_user_datas', allUser);
};

module.exports = {
    allUserModel,
};
