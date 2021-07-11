var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var JobApplicationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    job: { type: Schema.Types.ObjectId, ref: "Job", default: null },
    resume: { type: String, default: "" },
    date: { type: Date, default: new Date() },
    application_status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
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

module.exports = mongoose.model("Job_application", JobApplicationSchema);
