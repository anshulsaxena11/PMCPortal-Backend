const mongoose = require('mongoose');

const routerVulnerabilityType = new mongoose.Schema({
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

const routerVulnerabilityTypes = mongoose.model("routerVulnerabilityType",routerVulnerabilityType);

module.exports = routerVulnerabilityTypes;