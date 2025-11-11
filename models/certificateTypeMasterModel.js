const mongoose = require('mongoose');

const certificateTypeMasterSchema = new mongoose.Schema({
    certificateType:{
        type:String,
        unique:true,
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

const CertificateTypeMaster = mongoose.model('CertificateTypeMaster', certificateTypeMasterSchema);

module.exports = CertificateTypeMaster;