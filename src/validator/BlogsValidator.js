const yup = require("yup");

const BlogsValidation = yup.object({
  body: yup.object({
    siteId: yup.number().required("Site Id Is Required"),
    title: yup.string().required("Blog Title Is Required"),
    metaTitle: yup.string().required("Blog Meta-Title Is Required"),
    metaDescription: yup.string().required("Blog Meta-Description Is Required"),
    metaKeywords: yup.string().required("Blog Meta-Keywords Is Required"),
    url: yup.string().required("Blog URL Is Required"),
  }),
});

const validation = (schema) => async (req, res, next) => {
  try {
    await schema.validate({ body: req.body });
    return next();
  } catch (error) {
    return res.status(500).json({
      baseResponse: { type: error.name, message: error.message, status: 0 },
    });
  }
};

let validate = validation(BlogsValidation);

module.exports = validate;
