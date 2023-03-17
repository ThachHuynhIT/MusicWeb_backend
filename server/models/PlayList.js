const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Playlist = new Schema(
  {
    userId: { type: String },
    name: { type: String },
    img: { type: String },
    songList: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", Playlist);
