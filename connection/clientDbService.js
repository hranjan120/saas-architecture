const getAllTenants = async (dbConnection) => {
    try {
        const TenantTable = await dbConnection.model('tenant_master_datas');
        const tenants = await TenantTable.find({ tenantStatus: 1 });
        return tenants;
    } catch (error) {
        console.log('getAllTenants error', error);
        throw error;
    }
};

module.exports = { getAllTenants };
