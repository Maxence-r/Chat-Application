const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema({
  creator: { type: String, required: true},
  creatorname: { type: String, required: true},
  creatoravatar: { type: String, required: true},
  participant: { type: String, required: true},
  participantname: { type: String, required: true },
  participantavatar: { type: String, required: true },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;