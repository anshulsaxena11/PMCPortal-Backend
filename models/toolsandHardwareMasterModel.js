const mongoose = require('mongoose');

const toolsAndHardwareMaster = new mongoose.Schema({
   
   tollsName:{
    type:String,
    unique:true,
    require:true
   },
   toolsAndHardwareType:{
    type:String,
    enum: ['Software', 'Hardware'],
    require:true
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

const ToolsAndHardwareMaster = mongoose.model("toolsAndHardwareMaster",toolsAndHardwareMaster);

module.exports = ToolsAndHardwareMaster;