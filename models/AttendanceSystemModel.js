const mongoose = require('mongoose');

const attendanceSystemVulnerabilityType = new mongoose.Schema({
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

const attendanceSystemVulnerabilityTypes = mongoose.model("attendanceSystemVulnerabilityType",attendanceSystemVulnerabilityType);

module.exports = attendanceSystemVulnerabilityTypes;