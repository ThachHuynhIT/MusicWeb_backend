const { ObjectId } = require("mongodb");

module.exports = function isObjectId(id) {
  return ObjectId.isValid(id);
};
