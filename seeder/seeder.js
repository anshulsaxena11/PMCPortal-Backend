const mongoose = require('mongoose');  // Import mongoose
const XLSX = require('xlsx');          // Import XLSX for reading the Excel file
const VulnerabilityType = require('../models/switchLTwo');  // Import your model

// MongoDB connection function
const connectToDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/STPI_NOIDA_AUTOMATION', {
      connectTimeoutMS: 100000,  // Optional, adjust timeout as needed
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// Function to import Excel file into MongoDB
async function importExcelToMongo(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming you're using the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to a JSON array
    const data = XLSX.utils.sheet_to_json(sheet);

    // Log the parsed data (optional)
    console.log("Parsed Data:", data);

    // Map over the data and insert into the database
    for (const item of data) {
      const { 
       vulnerabilityTypes,
       severity,
       description,
       impact,
       recommendation,
       vulnarabilityParameter,
       references,
      } = item;

      // Insert the data into MongoDB
      await VulnerabilityType.create({
       vulnerabilityTypes,
       severity,
       description,
       impact,
       recommendation,
       vulnarabilityParameter,
       references,
       criteria:'Switch-L2'
      });
    }

    console.log('Data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Main function to execute the seeder
async function seedDatabase() {
  const filePath = './switch-L2Vulnerability.xlsx'; // Replace with the actual file path

  try {
    // Connect to the database
    await connectToDB();

    // Import Excel data into MongoDB
    await importExcelToMongo(filePath);

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close the MongoDB connection (move this here to ensure it's always closed)
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeder
seedDatabase();
