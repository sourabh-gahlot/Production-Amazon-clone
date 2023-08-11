const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken")
const secretKey=process.env.KEY

const userSchema = new mongoose.Schema({
  Fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid Email address");
      }
    },
  },
  Mobile: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  token: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  carts: Array,
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

//token generate process
userSchema.methods.generateAuthToken=async function(){
  try {
    let token = jwt.sign({_id:this._id},secretKey)
    // console.log(this._id)
    this.token=this.token.concat({token:token})
    await this.save();
    return token
  } catch (error) {
    throw new Error("error")
  }
}
//add to cart data
userSchema.methods.addcartdata=async function(cart){
  try {
    this.carts=this.carts.concat(cart)
    await this.save()
    return this.carts 
  } catch (error) {
    throw new Error("error") 
  }
}



const Users = new mongoose.model("USER", userSchema);



module.exports = Users;
