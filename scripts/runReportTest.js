const mongoose = require('mongoose');
require('dotenv').config();

const { generateAndEmailReportInternal } = require('../controller/usercontroller');
const connectDB = require('../Config/dbConfig');

async function run() {
  try {
    await connectDB();
    // provide minimal emailSettings object matching DB shape expected by the function
    const emailSettings = {
      weeklyMailEnabled: true,
      frequency: 'daily', // or 'weekly'
      day: '',
      time: ''
    };

    await generateAndEmailReportInternal(emailSettings);
    console.log('generateAndEmailReportInternal finished');
    process.exit(0);
  } catch (err) {
    console.error('Test run failed:', err);
    process.exit(1);
  }
}

run();
