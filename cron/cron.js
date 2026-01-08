const cron = require('node-cron');
const EmailSetting = require('../models/emailSetting');
const { generateAndEmailReportInternal } = require('../controller/usercontroller');
const dayjs = require('dayjs');

const startEmailCronJob = () => {

    cron.schedule('0 8 * * *', async () => {
        try{
            const emailSettings = await EmailSetting.findOne( );
            if (!emailSettings || !emailSettings.weeklyMailEnabled) return;
            const now = dayjs();
            const currentTime = now.format('HH:mm');
            const currentDay = now.format('dddd');

            // Only run when configured time matches current time
            if (emailSettings.time === currentTime) {
                if (emailSettings.frequency === 'daily') {
                    await generateAndEmailReportInternal(emailSettings);
                }

                if (emailSettings.frequency === 'weekly' && emailSettings.day === currentDay) {
                    await generateAndEmailReportInternal(emailSettings);
                }
            }
            
        }catch(error){
            console.error('Error in email cron job:', error);
        }
    })

    console.log('Email cron job scheduled (daily @ 08:00)');
}

module.exports = startEmailCronJob;

