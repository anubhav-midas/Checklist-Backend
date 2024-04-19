const express = require("express");

const { UpdateBlogById } = require("../../controller/Blogs/BlogsController");
const {
  AddAboutus,
  GetAboutus,
  EditAboutus,
} = require("../../controller/SeoPages/AboutUs/AboutUsController");
const verifyToken = require("../../../TokenMiddleware/middleware");

// const validate = require("../validator/BlogsValidator");

const Aboutus = express.Router();

Aboutus.post("/createAboutus", verifyToken, AddAboutus);
Aboutus.get("/getAboutus/:siteId", verifyToken, GetAboutus);
Aboutus.patch("/editAboutus/:id", verifyToken, EditAboutus);

module.exports = Aboutus;
