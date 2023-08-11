require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const Products = require("./models/productSchema");
const cors = require("cors");
const router = require("./routes/router");
const DefaultData = require("./defaultData");
const cookieParser = require("cookie-parser");
const path = require("path");

const port = 8080;
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

//static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.listen(port, () => {
  // console.log(`server is running on ${port}`);
});

DefaultData();
