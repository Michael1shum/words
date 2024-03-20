const mongoose = require("mongoose");
const { db } = require("../configuration");

// const testsArray = require('../index');


module.exports.connectDb = () => {
  mongoose.connect(db);

  return mongoose.connection;
};

// module.exports.addTest = (test) => {
//   testsArray.push(test);
//    console.log("testArrayasd", testsArray);
// };
