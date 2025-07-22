const express = require("express")
require('dotenv').config();
const cors = require('cors')
const http = require("http");
const cookieParser = require('cookie-parser');
const connectDB = require("./Config/dbConfig")
const bodyParser = require('body-parser');
const session = require("express-session");
const path = require('path');
const app = express();
const port = process.env.PORT
const Host = process.env.HOST
const Url = process.env.React_URL
app.set('trust proxy', true);
connectDB();
app.use(cors({
  origin: Url,
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
app.use('/uploads', express.static(path.join(__dirname, './uploads'), {
  setHeaders: function (res, path) {
    res.setHeader('Access-Control-Allow-Origin', 'https://pmcportal.stpi.in');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/pdf');
  }
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIROMENT === "production",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 8 * 60 * 60 * 1000 
  }
}));

// .....routes...
app.use('/api/v1', require('./routes/indexRoutes'));
http.createServer(app);

app.listen(port, Host ,() => {
    console.log(`Server is running on ${port}`)
}); 

