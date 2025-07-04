const mongoose = require('mongoose');

const CameraVulnerabilityType = new mongoose.Schema({
    vulnerabilityTypes:String,
    severity:String,
    description:String,
    impact:String,
    recommendation:String,
    vulnarabilityParameter:String,
    references:String,
    criteria:String,
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

const CameraVulnerabilityTypes = mongoose.model("CameraVulnerabilityType",CameraVulnerabilityType);

module.exports = CameraVulnerabilityTypes;