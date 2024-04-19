const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "./src/applicationProperties.env",
});
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      baseResponse: {
        message: "A token is required for authentication",
        status: 0,
      },
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({
      baseResponse: {
        message: "Invalid Token",
        status: 0,
      },
    });
  }
  return next();
};

module.exports = verifyToken;
