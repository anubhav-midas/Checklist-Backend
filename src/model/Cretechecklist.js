const mongoose = require("mongoose");
const listitems = require("./checklistfields");

const newChecklist = new mongoose.Schema({
  Listname: String,
  list: [listitems],
});

const checklistJson = new mongoose.model("newchecklist", newChecklist);
module.exports = checklistJson;
