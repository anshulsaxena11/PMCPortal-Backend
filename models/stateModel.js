const mongoose = require('mongoose');

const state = new mongoose.Schema({
    stateName:String,
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

const State = mongoose.model("state",state);

module.exports = State;