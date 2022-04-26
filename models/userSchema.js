const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchemaObj = new Schema({
  userFullName: { type: String, required: true },
  userEmail: { type: String, required: true, trim: true, unique: true},
  userPwd: { type: String, required: true },
  userImage: { type: String, default: '' },
  userAddress: { type: String, default: '' },
  userStatus: { type: String, enum: ['1', '2'], default: '1' }, // 1-active, 2-in active
}, { timestamps: true });

const userSchema = (dbName) => {
  return dbName.model('all_users', userSchemaObj);
}
module.exports = userSchema;
