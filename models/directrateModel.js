const mongoose = require('mongoose');

const directrateSchema = new mongoose.Schema({
 directrate:String,
 stateId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }],
 createdAt:{
    type: Date,
    default: Date.now,
  },
})

const Directrate = mongoose.model("directrate",directrateSchema);

module.exports = Directrate;