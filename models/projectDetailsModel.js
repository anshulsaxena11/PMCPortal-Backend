const mongoose = require('mongoose');

const projectDetailsSchema = new mongoose.Schema({
    workOrderNo:{
        type:String,
        unique:true
    },
    orderType:String,
    type:String,
    orginisationName:String,
    projectName:{ 
        type:String,
        unique:true,
    },
    domain:{type: mongoose.Schema.Types.ObjectId, ref: "DomainMaster"},
    startDate:{type:Date, default:null},
    endDate:{type:Date, default:null},
    projectType: [{
        type: mongoose.Schema.Types.ObjectId, 
      }],
    resourseMapping:[{
        type: mongoose.Schema.Types.ObjectId, 
    }],
    projectManager:String,
    noOfauditor:String,
    projectValue:String,
    primaryPersonName:String,
    secondaryPersonName:String,
    primaryPersonPhoneNo:String,
    secondaryPrsonPhoneNo: String,
    primaryPersonEmail:String,
    secondaryPersonEmail:String,
    paymentMethod:String,
    projectValueYearly:[{
        financialYear:String,
        amount:String,
    }],
    directrate:String,
    typeOfWork:String,
    serviceLocation:String,
    workOrder:String,
    primaryRoleAndDesignation:{
        type:String,
        default:'N/A'
    },
    secondaryRoleAndDesignation:{
        type:String,
        default:'N/A'
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
    updatedAt:{
        type: Date,
        default: null,
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
projectDetailsSchema.virtual('phases', {
    ref: 'ProjectPhase',         
    localField: '_id',             
    foreignField: 'ProjectId',     
});

projectDetailsSchema.set('toObject', { virtuals: true });
projectDetailsSchema.set('toJSON', { virtuals: true });


const ProjectDetails = mongoose.model('ProjectDetails', projectDetailsSchema);

module.exports = ProjectDetails;