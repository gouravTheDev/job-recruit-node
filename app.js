require("dotenv").config();

// core modules
const {
  join,
  resolve
} = require('path');

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
_ = require("underscore");

const { promisify } = require("util");

const { stat, readdir } = require("fs");

auth = require(resolve(join(__dirname, 'middleware', 'auth')))();

var corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

async function isDirectory(f) {
  return (await promisify(stat)(f)).isDirectory();
}

async function _readdir(filePath) {
  const files = await Promise.all(
    (
      await promisify(readdir)(filePath)
    ).map(async (f) => {
      const fullPath = join(filePath, f);
      return (await isDirectory(fullPath)) ? _readdir(fullPath) : fullPath;
    })
  );

  return _.flatten(files);
}

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));


app.use((req, res, next) => {
  auth = require(resolve(join(__dirname, 'middleware', "auth")))(req, res, next);
  app.use(auth.initialize());

  // This is for webservice end
  if (req.headers['token'] != null) {
      req.headers['token'] = req.headers['token'];
  }
  next();
});

(async () => {
  // Configure Routes
  const apiFiles = await _readdir(`./routes/`);
  apiFiles.forEach((file) => {
    if (!file && file[0] == ".") return;
    app.use("/", require(join(__dirname, file)));
  });

  //PORT
  const port = process.env.PORT || 8000;

  //Starting a server
  app.listen(port, () => {
    console.log(`app is running at ${port}`);
  });
})();
