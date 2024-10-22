const mongoose = require("mongoose");
// require("dotenv").config({
//   path: "./src/applicationProperties.env",
// });

const url =
  "mongodb+srv://Mayank:Mayank12@legal-crm.wsfzr5m.mongodb.net/Legal-CRM?retryWrites=true&w=majority";
// const url =
//   "mongodb+srv://mayanktripathi:Mayank033023%40@cluster0.70j8z4s.mongodb.net/Legal-CRM?retryWrites=true&w=majority";
mongoose
  .connect(url)
  .then(() => console.log("DB Is connected"))
  .catch((err) => console.log(err));
