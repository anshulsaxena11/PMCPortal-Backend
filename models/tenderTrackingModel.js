const mongoose = require('mongoose');

const TenderTrackingSchema = new mongoose.Schema({
    tenderName:{ type: String, unique: true },
    organizationName:String,
    state:String,
    taskForce:String,
    valueINR:String,
    status:String,
    message:String,
    messageStatus:String,
    tenderDocument:String,    
    lastDate:{type:Date, default:null},
    StatusChangeDate:{type:Date, default:null},
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
    updatedByIp:{
        type:String
    },
    updatedById:{
        type:String
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: {
      type: Date,
      default: null,
    },
     deletedByIp:{
        type:String
    },
    deletedById:{
        type:String
    },
});

module.exports = mongoose.model('TenderTracking', TenderTrackingSchema);