const mongoose = require('mongoose');

const vcEquipmentVulnerabilityType = new mongoose.Schema({
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

const vcEquipmentVulnerabilityTypes = mongoose.model("vcEquipmentVulnerabilityType",vcEquipmentVulnerabilityType);

module.exports = vcEquipmentVulnerabilityTypes;