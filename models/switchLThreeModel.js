const mongoose = require('mongoose');

const SwitchLThreeVulnerabilityType = new mongoose.Schema({
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

const SwitchLThreeVulnerabilityTypes = mongoose.model("SwitchLThreeVulnerabilityType",SwitchLThreeVulnerabilityType);

module.exports = SwitchLThreeVulnerabilityTypes;