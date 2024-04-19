const yup = require("yup");
/* RESGISTERVALIDATION */
const ResgisterValidationSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Name Is Required"),
    email: yup
      .string()
      .email("Must Enter A Valid E-mail")
      .required("E-mail Is Required"),
    status: yup.number().required("Status Is Required"),
    roleId: yup.number().required("Role-Id Is Required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 5 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .required("Password Is  Required"),
    managerId: yup.number().required("Site Id Is Required"),
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

let registerValidation = validation(ResgisterValidationSchema);
/* RESGISTERVALIDATION */

/* LOGIN SCHEMAVALIDATION  */
const LoginValidationSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email("Must Enter A Valid E-mail")
      .required("E-mail Is Required"),
    password: yup.string().required("Password Is  Required"),
  }),
});

const Loginvalidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate({ body: req.body });
    return next();
  } catch (error) {
    return res.status(500).json({
      baseResponse: { type: error.name, message: error.message, status: 0 },
    });
  }
};

let validateLogin = Loginvalidation(LoginValidationSchema);
/* LOGIN SCHEMAVALIDATION  */

module.exports = { registerValidation, validateLogin };
