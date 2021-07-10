var mongoose = require("mongoose");

var JobSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    salary: { type: String, default: "" },
    position: { type: Number, default: 0 },
    details: { type: String, default: "" },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    isDeleted: { type: Boolean, default: false, enum: [true, false] },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Job", JobSchema);

