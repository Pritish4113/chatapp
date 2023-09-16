const mongoose = require("mongoose");

const {Schema} = mongoose;

const messageModel = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  content : {type : String, trim : true}
}, {
    timestamps : true
});

const Message = mongoose.model("Message", messageModel);
module.exports = Message;