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
})

const ToolsAndHardwareMaster = mongoose.model("toolsAndHardwareMaster",toolsAndHardwareMaster);

module.exports = ToolsAndHardwareMaster;