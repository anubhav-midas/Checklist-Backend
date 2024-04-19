const express = require("express");
const {
  AddBlogs,
  GetAllBlogs,
  GetBlogById,
  UpdateBlogById,
  DeleteBlogById,
  GetAllBlogsCRM,
} = require("../controller/Blogs/BlogsController");
const validate = require("../validator/BlogsValidator");
const verifyToken = require("../../TokenMiddleware/middleware");

const blogRouter = express.Router();

blogRouter.post("/createNewBlog", verifyToken, AddBlogs);
blogRouter.get("/getAllBlogs", verifyToken, GetAllBlogs);
blogRouter.get("/getAllBlogsCRM", verifyToken, GetAllBlogsCRM);
blogRouter.get("/getBlogById/:blogId", verifyToken, GetBlogById);
blogRouter.patch("/editBlog/:blogId", verifyToken, UpdateBlogById);
blogRouter.put("/removeBlog/:blogId", verifyToken, DeleteBlogById);

module.exports = blogRouter;
