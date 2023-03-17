const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const Singer = new Schema(
  {
    name: { type: String, require: true },
    age: { type: String },
    img: { type: String },
    nation: { type: String },
    album: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);
  
Singer.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Singer", Singer);
