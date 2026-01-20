const cron = require('node-cron');
const EmailSetting = require('../models/emailSetting');
const { generateAndEmailReportInternal } = require('../controller/usercontroller');
const dayjs = require('dayjs');

const startEmailCronJob = () => {

    // Run every hour at minute 0 to check if email should be sent
    cron.schedule('0 * * * *', async () => {
        try{
            const emailSettings = await EmailSetting.findOne( );
            if (!emailSettings || !emailSettings.weeklyMailEnabled) return;
            
            const now = dayjs();
            const currentTime = now.format('HH:mm');
            const currentDay = now.format('dddd');

            console.log(`[Email Cron] Checking at ${currentTime}, Day: ${currentDay}, Configured time: ${emailSettings.time}, Frequency: ${emailSettings.frequency}`);

            // Only run when configured time matches current time (HH:mm format)
            if (emailSettings.time && emailSettings.time === currentTime) {
                console.log('[Email Cron] Time matched! Triggering email generation...');
                
                if (emailSettings.frequency === 'daily') {
                    console.log('[Email Cron] Sending daily report...');
                    await generateAndEmailReportInternal(emailSettings);
                }

                if (emailSettings.frequency === 'weekly' && emailSettings.day === currentDay) {
                    console.log(`[Email Cron] Sending weekly report for ${currentDay}...`);
                    await generateAndEmailReportInternal(emailSettings);
                }
            }
            
        }catch(error){
            console.error('Error in email cron job:', error);
        }
    })

    console.log('Email cron job scheduled (checks hourly)');
}

module.exports = startEmailCronJob;

