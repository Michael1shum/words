const mongoose = require("mongoose");
const { db } = require("../configuration");

module.exports.connectDb = () => {
  mongoose.connect(db);

  return mongoose.connection;
};
const testArray = [];

module.exports.addTest = (test) => {
  testArray.push(test);
  console.log("testArrayasd", testArray);
};
