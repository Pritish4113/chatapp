const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userModel = new Schema(
  {
    name: { type: String, required: true, default : "Guest User" },
    email: { type: String, required: true, unique : true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);


//before saving the schema....we encrpyt the password using bcrypt library
userModel.pre("save", async function (next) {
  if(!this.isModified){
    next();
  } 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})


//creating a function for comparing the login password with the registered password
userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}


const User = mongoose.model("User", userModel);
module.exports = User;
 