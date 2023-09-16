const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to mongodb atlas")
}

module.exports = main;