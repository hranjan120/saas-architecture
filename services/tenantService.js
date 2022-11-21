/*
*
*/
exports.insertTenantData = async (dbConn, bodyData) => {
    const TenantTable = await dbConn.model('tenant_master_datas');

    const newData = new TenantTable({
        tenantName: bodyData.tenantName,
        tenantId: bodyData.tenantId,
        tenantDbName: bodyData.tenantDbName,
    });

    await newData.save();
    return true;
};

/*--------------*/
exports.getAllTenant = async (dbConn) => {
    const TenantTable = await dbConn.model('tenant_master_datas');

    const tenantData = TenantTable.find({ tenantStatus: 1 }).sort({ createdAt: -1 });
    return tenantData;
};

/*---------*/
exports.fetchTenantBySubdomain = async (dbConn, tid) => {
    const TenantTable = await dbConn.model('tenant_master_datas');

    const tenantData = TenantTable.findOne({ tenantId: tid, tenantStatus: 1 });
    return tenantData;
};
