const mongoose = require("mongoose");
require("dotenv").config();

main()
  .then(console.log("DB Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}

module.exports = mongoose;
