const mongoose = require('mongoose');

const WebVulnerabilityType = new mongoose.Schema({
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

const webVulnerabilityTypes = mongoose.model("WebVulnerabilityType",WebVulnerabilityType);

module.exports = webVulnerabilityTypes;