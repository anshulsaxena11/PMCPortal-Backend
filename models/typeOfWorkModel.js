const mongoose = require('mongoose');

const typeOfWork = new mongoose.Schema({
     typeOfWork: {
        type: String,
        unique: true, 
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    createdIp:{
        type:String
    },
    createdId:{
        type:String
    },
    updatedAt:{
        type: Date,
    },
    updatedIp:{
        type:String
    },
    updatedId:{
        type:String
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
})

const TypeOfWork = mongoose.model("typeOfWork",typeOfWork);

module.exports = TypeOfWork;