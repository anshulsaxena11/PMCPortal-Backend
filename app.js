const express = require("express")
require('dotenv').config();
const cors = require('cors')
const http = require("http");
const connectDB = require("./Config/dbConfig")
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT
const Host = process.env.HOST
connectDB();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// .....routes...
app.use('/api/v1', require('./routes/indexRoutes'));
http.createServer(app);

app.listen(port, Host ,() => {
    console.log(`Server is running on ${port}`)
}); 

