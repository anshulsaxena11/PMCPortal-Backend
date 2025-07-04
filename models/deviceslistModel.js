const mongoose = require('mongoose');

const deviceListSchema = new mongoose.Schema({
 devicesName:String,
 createdAt:{
    type: Date,
    default: Date.now,
  },
})

const DeviceList = mongoose.model("DeviceList",deviceListSchema);

module.exports = DeviceList;