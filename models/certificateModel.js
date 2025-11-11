const mongoose = require('mongoose');

const certificateDetailsSchema = new mongoose.Schema({
    certificateName:{ type: mongoose.Schema.Types.ObjectId, ref: "CertificateMaster" },
    certificateType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CertificateTypeMaster',
    },
    assignedPerson:{ type: mongoose.Schema.Types.ObjectId, ref: "stpiEmp" },
    issuedDate:{type:Date, default:null},
    validUpto:{type:Date, default:null},
    uploadeCertificate:String,
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

const CertificateDetails = mongoose.model('CertificateDetails', certificateDetailsSchema);

module.exports = CertificateDetails;