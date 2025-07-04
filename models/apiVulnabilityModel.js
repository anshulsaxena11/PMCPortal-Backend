const mongoose = require('mongoose');

const ApiVulnerabilityType = new mongoose.Schema({
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

const apiVulnerabilityTypes = mongoose.model("ApiVulnerabilityType",ApiVulnerabilityType);

module.exports = apiVulnerabilityTypes;