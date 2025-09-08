const mongoose = require('mongoose');

const toolsAndHardware = new mongoose.Schema({
   
    tollsName:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date, 
        default:null
    },
    endDate:{
        type:Date, 
        default:null
    },
    directorates:{
        type:String,
        required:true
    },
    purchasedOrder:{
        type:String,
        required:true
    },
    assignedTo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    createdIp:{
        type:String,
    },
    createdId:{
        type:String,
    },
   isDeleted: { 
        type: Boolean, 
        default: false 
    },
    updatedAt:{
        type:Date
    },
    updatedIP:{
        type:String
    },
    updatedId:{
        type:String
    },
     isDeletedIp:{
        type:String
    },
    isDeletedId:{
        type:String
    },
    isDeletedAt:{
        type:Date
    }
})

const ToolsAndHardware = mongoose.model("toolsAndHardware",toolsAndHardware);

module.exports = ToolsAndHardware;
  