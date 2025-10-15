const mongoose = require('mongoose');

const TenderTrackingSchema = new mongoose.Schema({
    tenderName:{ type: String, unique: true },
    organizationName:String,
    state:String,
    valueINR:String,
    status:String,
    message:String,
    messageStatus:String,
    tenderDocument:String, 
    taskforceempid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "stpiEmp",  
  },   
    lastDate:{type:Date, default:null},
    comment:[{
        comments:String,
        commentedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "Login" },
        commentedOn:Date,
    }],
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
        StatusChangeDate:{
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