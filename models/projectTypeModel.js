const mongoose = require('mongoose');

const ProjectTypeSchema = new mongoose.Schema({
 ProjectTypeName:{
    type:String,
    required:true,
    unique:true
  },
  category:{
    type:String,
    required:true
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },
  createdId: {
    type:String,
  },
  createdIP:{
    type:String,
  },
  isDeleted: { 
      type: Boolean, 
      default: false 
  },
  isDeletedAt:{
      type: Date,
  },
  isDeletedIp:{
      type:String
  },
  isDeletedId:{
      type:String
  },
  updatedAt:{
    type: Date,
  },
  updatedIP:{
      type:String
  },
  updatedId:{
      type:String
  },
})

const ProjectType = mongoose.model("ProjectType",ProjectTypeSchema);

module.exports = ProjectType;