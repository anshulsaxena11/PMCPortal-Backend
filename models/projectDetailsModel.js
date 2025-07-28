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
    directrate:String,
    typeOfWork:String,
    serviceLocation:String,
    workOrder:String,
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
projectDetailsSchema.virtual('phases', {
    ref: 'ProjectPhase',           // 👈 model name of the target
    localField: '_id',             // 👈 from ProjectDetails
    foreignField: 'ProjectId',     // 👈 from ProjectPhase
});

projectDetailsSchema.set('toObject', { virtuals: true });
projectDetailsSchema.set('toJSON', { virtuals: true });


const ProjectDetails = mongoose.model('ProjectDetails', projectDetailsSchema);

module.exports = ProjectDetails;