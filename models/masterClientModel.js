const mongoose = require('mongoose');

const { Schema } = mongoose;

const masterClientSchema = new Schema({
  clientName: { type: String, required: true },
  clientEmail: [{ type: String, required: true, trim: true}],
  clientDomain: { type: String, required: true },
  clientDb: { type: String, required: true },
  clientPwd: { type: String, required: true },
  clientLogo: { type: String, default: '' },
  clientDesc: { type: String, default: '' },
  clientStatus: { type: String, enum: ['1', '2'], default: '1' }, // 1-active, 2-in active
}, { timestamps: true });

module.exports = mongoose.model('master_client_datas', masterClientSchema);
