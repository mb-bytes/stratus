const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Note",
      trim: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    color: {
      type: String,
      default: "#ffffff",
    },

    job_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Note", noteSchema);
