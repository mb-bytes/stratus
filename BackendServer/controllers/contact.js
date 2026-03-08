const Contact = require("../models/messages");
const { mesgSchema } = require("../schemaValid");

module.exports.validateMessage = (req, res, next) => {
  const { error } = mesgSchema.validate(req.body);
  if (error) {
    let messages = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({ error: messages });
  }
  next();
};

module.exports.newMessage = async (req, res) => {
  const { name, email, mesg } = req.body;
  try {
    const newMsg = new Contact({
      name,
      email,
      text: mesg,
    });
    await newMsg.save();
    if (newMsg) {
      res.status(200).json({
        message: "Your message is delivered, expect response within 24 hours",
        newMsg,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in sending message, please try again" });
  }
};
