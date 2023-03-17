const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const Album = new Schema(
  {
    name: { type: String, require: true },
    type: { type: String },
    img: { type: String },
    singer: { type: String },
    description: { type: String },
    slug: { type: String, slug: "name", unique: true },
  },
  { timestamps: true }
);

// add plugin
mongoose.plugin(slug);
Album.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports = mongoose.model("Album", Album);
