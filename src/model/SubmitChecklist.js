const mongoose = require("mongoose");

const ChecklistSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phoneno: Number,
  email: String,
  categoryname: String,
  dob: String,
  ssn: Number,
  references: Array,
  list: Array,
  requestTimeOffDate: Object,
  address: String,
});

const CheckList = new mongoose.model("CheckList", ChecklistSchema);
module.exports = CheckList;
