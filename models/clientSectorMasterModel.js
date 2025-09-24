const mongoose = require('mongoose');

const clientSectorMasterSchema = new mongoose.Schema({
    clientType:{
        type:String,
    },
    type:{
        type:String,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    createdbyIp:{
        type:String
    },
    createdById:{
        type:String
    },
    update:[{
        updatedAt:{
            type: Date,
        },
        updatedByIp:{
            type:String
        },
        updatedById:{
            type:String
        },
    }],
    isDeleted: { type: Boolean, default: false },
    deleted:[{
        deletedAt: {
          type: Date,
        },
          deletedByIp:{
            type:String
        },
        deletedById:{
            type:String
        },
    }]
});

const ClientSectorMaster = mongoose.model('ClientSectorMaster', clientSectorMasterSchema);

module.exports = ClientSectorMaster;