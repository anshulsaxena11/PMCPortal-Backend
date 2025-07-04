const mongoose = require('mongoose');

const WiFiVulnerabilityType = new mongoose.Schema({
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

const WiFiVulnerabilityTypes = mongoose.model("WiFiVulnerabilityType",WiFiVulnerabilityType);

module.exports = WiFiVulnerabilityTypes;