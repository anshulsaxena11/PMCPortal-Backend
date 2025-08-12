const mongoose = require('mongoose');

const ProjectPhaseSchema = new mongoose.Schema({
    ProjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ProjectDetails',
        required:true,
        unique:true
    },
    invoiceGenerated:[{
        noOfInvoice:{type:String},
        invoiceDate:{type:Date,default:null},
        invoiceValue:{type:String},
        amountRaised:{type:String}
    }],
    amountStatus:{
        type:String,
    },
    phase:[{
        noOfPhases:{
            type:String,
        },
        projectStartDate:{type:Date, default:null},
        testCompletedEndDate:{type:Date, default:null}, 
        reportSubmissionEndDate:{type:Date, default:null},
        comments:String,
    }],
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

const ProjectPhase = mongoose.model("ProjectPhase",ProjectPhaseSchema);

module.exports = ProjectPhase;