const mongoose = require('mongoose');

const { Schema } = mongoose;

const tenantMasterModel = async (dbconn) => {
    const tenantMaster = new Schema({
        tenantName: { type: String, required: true },
        tenantId: { type: String, unique: true, required: true },
        tenantDbName: {
            type: String, trim: true, unique: true, required: true,
        },
        tenantStatus: { type: String, enum: ['1', '2'], default: '1' },
    }, {
        timestamps: true,
    });
    dbconn.model('tenant_master_datas', tenantMaster);
};

module.exports = {
    tenantMasterModel,
};
