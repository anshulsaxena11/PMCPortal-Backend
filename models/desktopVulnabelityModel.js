const mongoose = require('mongoose');

const desktopVulnerabilityType = new mongoose.Schema({
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

const desktopVulnerabilityTypes = mongoose.model("desktopVulnerabilityType",desktopVulnerabilityType);

module.exports = desktopVulnerabilityTypes;