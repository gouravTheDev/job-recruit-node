var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var UserSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    password: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
  },
  { timestamps: true }
);

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
  //bcrypt.compare(jsonData.password, result[0].pass
};

module.exports = mongoose.model("User", UserSchema);
