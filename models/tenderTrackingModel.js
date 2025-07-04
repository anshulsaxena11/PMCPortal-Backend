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
    isDeleted: { type: Boolean, default: false },
    deletedAt: {
      type: Date,
      default: null,
    },
});

module.exports = mongoose.model('TenderTracking', TenderTrackingSchema);