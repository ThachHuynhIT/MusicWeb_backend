const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const mongooseDelete = require("mongoose-delete");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    img: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    nation: { type: String },
    role: { type: String , default:""},
    lastList: { type: String , default:""},
    typeList : {type :String, default:""},
    lastSong: { type: String, default:"" },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model("User", userSchema);
