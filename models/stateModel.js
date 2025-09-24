const mongoose = require('mongoose');

const state = new mongoose.Schema({
    stateName:String,
    taskForceMember:{type: mongoose.Schema.Types.ObjectId, ref: "stpiEmp"},
    stateCordinator:{type: mongoose.Schema.Types.ObjectId, ref: "stpiEmp"},
    createdAt:{
        type: Date,
        default: Date.now,
    },
    createdbyIp:{
        type:String
    },
    createdById:{
        type:String
    },
    update:[{
        updatedAt:{
            type: Date,
        },
        updatedByIp:{
            type:String
        },
        updatedById:{
            type:String
        },
    }],
    isDeleted: { type: Boolean, default: false },
    deleted:[{
        deletedAt: {
          type: Date,
        },
          deletedByIp:{
            type:String
        },
        deletedById:{
            type:String
        },
    }]
})

const State = mongoose.model("state",state);

module.exports = State;