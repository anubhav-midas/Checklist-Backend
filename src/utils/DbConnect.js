const mongoose = require("mongoose");
// require("dotenv").config({
//   path: "./src/applicationProperties.env",
// });

const url =
  "mongodb+srv://Mayank:Mayank12@legal-crm.wsfzr5m.mongodb.net/Legal-CRM-onprime?retryWrites=true&w=majority";

mongoose
  .connect(url)
  .then(() => console.log("DB Is connected"))
  .catch((err) => console.log(err));
