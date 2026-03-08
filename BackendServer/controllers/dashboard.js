const Job = require("../models/jobs.js");
const { jobSchema } = require("../schemaValid.js");

module.exports.validateJob = (req, res, next) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    let messages = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({ error: messages });
  }
  next();
};

module.exports.index = async (req, res) => {
  const jobs = await Job.find({ user_id: req.user._id });
  res.json({ jobs });
};

module.exports.postJob = async (req, res) => {
  let { company_name, role, status } = req.body;
  let newJob = new Job({
    company_name,
    role,
    status,
    user_id: req.user._id,
  });
  await newJob.save();
  res
    .status(201)
    .json({ message: `New entry in ${status} section`, job: newJob });
};

module.exports.deleteJob = async (req, res) => {
  let { id } = req.params;
  await Job.findByIdAndDelete(id);
  res.json({ message: "Job was deleted successfully" });
};

module.exports.updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["offered", "rejected", "applied", "interviewed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const updatedJob = await Job.findOneAndUpdate(
    { _id: id, user_id: req.user._id },
    { status },
    { new: true },
  );
  if (!updatedJob) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json({ message: "Status updated", job: updatedJob });
};

module.exports.addNotes = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const updatedJob = await Job.findOneAndUpdate(
    { _id: id, user_id: req.user._id },
    { notes },
    { new: true }
  );
  if (!updatedJob) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json({ message: "Notes updated", job: updatedJob });
};
