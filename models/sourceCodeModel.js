const mongoose = require('mongoose');

const sourceCodeVulnerabilityType = new mongoose.Schema({
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

const sourceCodeVulnerabilityTypes = mongoose.model("sourceCodeVulnerabilityType",sourceCodeVulnerabilityType);

module.exports = sourceCodeVulnerabilityTypes;