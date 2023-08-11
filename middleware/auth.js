const jwt = require("jsonwebtoken");
const Users = require("../models/userSchema");

const secretKey = process.env.KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.AmazonWeb;
    const verifyToken = jwt.verify(token, secretKey);
    // console.log(verifyToken);

    const rootUser = await Users.findOne({
      _id: verifyToken._id,
      "token.token": token,
    });
    // console.log(rootUser);
    if (!rootUser) {
      throw new Error("user Not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (error) {
    res.status(401).send("unauthorised User:No token");
    // console.log(error);
  }
};
module.exports = authenticate;
