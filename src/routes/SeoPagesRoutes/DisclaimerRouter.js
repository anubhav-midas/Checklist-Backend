const express = require("express");
const {
  AddDisclaimer,
  GetDisclaimer,
  EditDisclaimer,
} = require("../../controller/SeoPages/Disclaimer/DisclaimerController");
const { UpdateBlogById } = require("../../controller/Blogs/BlogsController");
const verifyToken = require("../../../TokenMiddleware/middleware");

// const validate = require("../validator/BlogsValidator");

const disclaimer = express.Router();

disclaimer.post("/createDisclaimer", verifyToken, AddDisclaimer);
disclaimer.get("/getDisclaimer/:siteId", verifyToken, GetDisclaimer);
disclaimer.patch("/editDisclaimer/:id", verifyToken, EditDisclaimer);

module.exports = disclaimer;
