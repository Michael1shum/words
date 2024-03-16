/** @format */

const { v4: uuidv4 } = require("uuid");
module.exports.getID = () => {
  const uid = uuidv4();
  return `a${uid.replace(/-/g, "")}`;
};
