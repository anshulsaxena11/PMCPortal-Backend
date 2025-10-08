const mongoose = require('mongoose');

const domainMasterSchema = new mongoose.Schema({
    domain:{
        type:String,
        unique:true,
    },
    // type:{
    //     type:String,
    // },
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

const DomainMaster = mongoose.model('DomainMaster', domainMasterSchema);

module.exports = DomainMaster;