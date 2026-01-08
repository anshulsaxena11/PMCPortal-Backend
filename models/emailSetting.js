const mongoose = require('mongoose');

const emailSettingSchema = new mongoose.Schema({
    weeklyMailEnabled: {
        type: Boolean,
        default: false,
    },
    day:{
        type: String,
    },
    frequency:{
        type: String,
        enum: ['daily', 'weekly'],
    },
    time:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    createdbyIp:{
        type:String
    },
    createdById:{
        type:String
    },
    update:[{
        updatedAt:{
            type: Date,
        },
        updatedByIp:{
            type:String
        },
        updatedById:{
            type:String
        },
    }],
    isDeleted: { type: Boolean, default: false },
    deleted:[{
        deletedAt: {
          type: Date,
        },
          deletedByIp:{
            type:String
        },
        deletedById:{
            type:String
        },
    }]
});

const EmailSetting = mongoose.model('EmailSetting', emailSettingSchema);

module.exports = EmailSetting;