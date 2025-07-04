const mongoose = require('mongoose');

const typeOfWork = new mongoose.Schema({
    typrOfWork:{
        type:String,
        unique:true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

const TypeOfWork = mongoose.model("typeOfWork",typeOfWork);

module.exports = TypeOfWork;