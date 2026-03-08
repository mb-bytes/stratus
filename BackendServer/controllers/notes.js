const Note = require("../models/note.js");
const Job = require("../models/jobs.js");

module.exports.getAllNotes = async (req, res) => {
  const notes = await Note.find({ user_id: req.user._id })
    .populate("job_ref", "company_name role status")
    .sort({ updatedAt: -1 });
  res.json({ notes });
};

module.exports.createNote = async (req, res) => {
  const { title, content, color, job_ref } = req.body;
  const note = new Note({
    user_id: req.user._id,
    title: title || "Untitled Note",
    content: content || null,
    color: color || "#ffffff",
    job_ref: job_ref || null,
  });
  await note.save();
  const populated = await note.populate("job_ref", "company_name role status");
  res.status(201).json({ message: "Note created", note: populated });
};

module.exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, color } = req.body;
  const updated = await Note.findOneAndUpdate(
    { _id: id, user_id: req.user._id },
    { title, content, color },
    { new: true },
  ).populate("job_ref", "company_name role status");
  if (!updated) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json({ message: "Note updated", note: updated });
};

module.exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  await Note.findOneAndDelete({ _id: id, user_id: req.user._id });
  res.json({ message: "Note deleted" });
};
