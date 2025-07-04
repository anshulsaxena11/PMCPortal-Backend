const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.DB_HOST,{
            connectTimeoutMS: 10000,
        });
        console.log('MOngoDb connected')
    }catch(error){
        console.log(error)
    }
}

module.exports = connectDB;