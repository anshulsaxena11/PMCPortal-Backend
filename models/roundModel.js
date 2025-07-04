const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
      },
      label: {
        type: String,
        required: true,
      },
     createdAt:{
        type: Date,
        default: Date.now,
    },
})

const Round = mongoose.model("Round",roundSchema);

module.exports = Round;