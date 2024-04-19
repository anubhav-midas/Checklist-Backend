const express = require("express");

const { UpdateBlogById } = require("../../controller/Blogs/BlogsController");
const {
  Addterms,
  Getterms,
  Editterms,
} = require("../../controller/SeoPages/TermsAndCondition/TermsController");
const verifyToken = require("../../../TokenMiddleware/middleware");

// const validate = require("../validator/BlogsValidator");

const Terms = express.Router();

Terms.post("/createTerms", verifyToken, Addterms);
Terms.get("/getTerms/:siteId", verifyToken, Getterms);
Terms.patch("/editTerms/:id", verifyToken, Editterms);

module.exports = Terms;
