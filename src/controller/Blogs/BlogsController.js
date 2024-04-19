const BlogsSchema = require("../../model/BlogsSchema");
const blogStatus = 1 || "1";
const AddBlogs = async (req, res) => {
  try {
    const {
      siteId,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      url,
      content,
      status,
    } = req.body;

    const NewBlog = new BlogsSchema({
      siteId,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      url,
      content,
      status,
    });

    const ifAlradyExist = await BlogsSchema.find({ title: title });
    if (ifAlradyExist.length >= 1) {
      res.status(422).json({
        message: "Blog With This Name Already Exist",
        status: 0,
      });
    } else if (siteId !== "" && url !== "") {
      await NewBlog.save();
      res
        .status(200)
        .json({ baseResponse: { message: "Created Successfuly", status: 1 } });
    } else {
      res
        .status(400)
        .json({ baseResponse: { message: "Bad Request", status: 0 } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ baseResponse: { message: error.message, status: 0 } });
  }
};
const GetAllBlogsCRM = async (req, res) => {
  const Blogs = await BlogsSchema.find({});

  try {
    if (Blogs.length !== 0) {
      res.status(200).json({
        baseResponse: { message: "All Blogs Fetched Successfully", status: 1 },
        response: Blogs,
      });
    } else {
      res.status(404).json({
        baseResponse: {
          message: "No Blogs Found",
          status: 0,
        },
        response: Blogs,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: 0 });
  }
};

const GetAllBlogs = async (req, res) => {
  const Blogs = await BlogsSchema.find({ status: blogStatus });
  try {
    if (Blogs.length !== 0) {
      res.status(200).json({
        baseResponse: { message: "All Blogs Fetched Successfully", status: 1 },
        response: Blogs,
      });
    } else {
      res.status(200).json({
        baseResponse: {
          message: "No Blogs Found",
          status: 0,
        },
        response: [],
      });
    }
  } catch (error) {
    if (Blogs === null) {
      res.status(404).json({
        baseResponse: { message: "No Blogs Found", status: 0 },
        response: [],
      });
    } else {
      res.status(500).json({ message: error.message, status: 0 });
    }
  }
};

const GetBlogById = async (req, res) => {
  const { blogId } = req.params;
  const Blogs = await BlogsSchema.findOne({ _id: blogId });

  try {
    if (Blogs.length !== 0) {
      res.status(200).json({
        baseResponse: { message: "Blog Fetched Successfully", status: 1 },
        response: Blogs,
      });
    } else {
      res.status(404).json({
        baseResponse: {
          message: "No Blogs Found",
          status: 0,
        },
        response: Blogs,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: 0 });
  }
};
const UpdateBlogById = async (req, res) => {
  const { blogId } = req.params;
  const { status, metaTitle, metaDescription, metaKeywords } = req.body;
  const Blogs = await BlogsSchema.findOneAndUpdate(
    { _id: blogId },
    {
      status: status,
      metaKeywords: metaKeywords,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
    }
  );

  try {
    if (Blogs.length !== 0) {
      res.status(200).json({
        baseResponse: {
          message: "Blog Fetched And Updated Successfully",
          status: 1,
        },
        response: Blogs,
      });
    } else {
      res.status(404).json({
        baseResponse: {
          message: "No Blogs Found And Updated",
          status: 0,
        },
        response: Blogs,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: 0 });
  }
};

const DeleteBlogById = async (req, res) => {
  const { blogId } = req.params;

  try {
    const Blogs = await BlogsSchema.findOneAndDelete({ _id: blogId });
    console.log(Blogs);
    if ((Blogs === null || Blogs.length) === 0) {
      res.status(404).json({
        baseResponse: {
          message: "No Blogs Found",
          status: 0,
        },
        response: [],
      });
    } else {
      res.status(200).json({
        baseResponse: { message: "Blog Deleted Successfully", status: 1 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: 0 });
  }
};

module.exports = {
  AddBlogs,
  GetAllBlogs,
  GetBlogById,
  UpdateBlogById,
  DeleteBlogById,
  GetAllBlogsCRM,
};
