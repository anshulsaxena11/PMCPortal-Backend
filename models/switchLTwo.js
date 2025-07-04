const mongoose = require('mongoose');

const SwitchLTwoVulnerabilityType = new mongoose.Schema({
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

const SwitchLTwoVulnerabilityTypes = mongoose.model("SwitchLTwoVulnerabilityType",SwitchLTwoVulnerabilityType);

module.exports = SwitchLTwoVulnerabilityTypes;