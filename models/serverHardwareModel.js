const mongoose = require('mongoose');

const serverHardwareVulnerabilityType = new mongoose.Schema({
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

const serverHardwareVulnerabilityTypes = mongoose.model("serverHardwareVulnerabilityType",serverHardwareVulnerabilityType);

module.exports = serverHardwareVulnerabilityTypes;