const express = require("express");

const router = new express.Router();

const Products = require("../models/productSchema");

const Users = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/auth");

// get productData api
router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log(productsdata)
    res.status(201).json(productsdata);
  } catch (err) {
    throw new Error("error"+ err.message)
  }
});

//get individual data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const individualdata = await Products.findOne({ id: id });
    // console.log(individualdata);
    res.status(201).json(individualdata);
  } catch (error) {
    res.status(400).json(error);
    throw new Error("error"+ err.message)
  }
});

//register data
router.post("/register", async (req, res) => {
  // console.log(req.body);
  const { Fname, email, Mobile, password, cpassword } = req.body;
  if (!Fname || !email || !Mobile || !password || !cpassword) {
    res.status(422).json({ error: "fill alll the data " });
    // console.log("no data available");
  }
  try {
    const preuser = await Users.findOne({ email: email });
    if (preuser) {
      res.status(422).json({
        error: "this user is already signed up",
      });
    } else if (password !== cpassword) {
      res.status(422).json({
        error: "this user password and cpassword is not matching",
      });
    } else {
      const user = new Users({
        Fname,
        email,
        Mobile,
        password,
        cpassword,
      });

      const storedata = await user.save();
      // console.log(storedata);
      res.status(201).json(storedata);
    }
  } catch (error) {
    throw new Error("error"+ err.message)
  }
});

//login user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "fill alll the data " });
    // console.log("no data available");
  }
  try {
    const userLogin = await Users.findOne({ email: email });
    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // console.log(isMatch);

      if (!isMatch) {
        res.status(422).json({
          error: "invalid details",
        });
      } else {
        //token generate
        const token = await userLogin.generateAuthToken();
        // console.log(token)
        res.cookie("AmazonWeb", token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.status(201).json(userLogin);
      }
    } else {
      res.status(422).json({
        error: "invalid details",
      });
    }
  } catch (error) {
    res.status(422).json({
      error: "invalid details",
    });
  }
});

//cart api

router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    // console.log(cart + "cart value");

    const userContact = await Users.findOne({ _id: req.userID });
    // console.log(userContact);

    if (userContact) {
      const cartData = await userContact.addcartdata(cart);
      await userContact.save();
      // console.log(cartData);
      res.status(201).json(userContact);
    } else {
      res.status(401).json({
        error: "invalid user",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "invalid user",
    });
  }
});

router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    const buyuser = await Users.findOne({ _id: req.userID });
    res.status(201).json(buyuser);
  } catch (error) {
    throw new Error("error"+ err.message)
  }
});
//get valid user validuser
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validuserone = await Users.findOne({ _id: req.userID });
    res.status(201).json(validuserone);
  } catch (error) {
    throw new Error("error"+ err.message)
  }
});

router.delete("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((val) => {
      return val.id != id;
    });
    req.rootUser.save();
    res.status(201).json(req.rootUser);
  } catch (error) {
    // console.log("error" + error);
    res.status(400).json(req.rootUser);
  }
});

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.token = req.rootUser.token.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("AmazonWeb", { path: "/" });
    req.rootUser.save();
    res.status(201).json(req.rootUser.token);
    // console.log("user logout");
  } catch (error) {
    throw new Error("error"+ err.message)
  }
});

module.exports = router;
