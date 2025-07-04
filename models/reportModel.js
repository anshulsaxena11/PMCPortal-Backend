const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    projectName:{ 
        type:String,
        ref: 'ProjectDetails'
    },
    projectType:String,
    round:String,
    ipAddress:String,
    Name:String,
    vulnerabilityName:String,
    sevirty:String,
    description:String,
    devices:String,
    path:String,
    impact:String,
    vulnerableParameter:String,
    references :String,
    proofOfConcept:[{
        noOfSteps:String,
        description:String,
        proof:String,
    }], 
    recomendation:String,
    isDeleted:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

const Report = mongoose.model("Report",reportSchema);

module.exports = Report;