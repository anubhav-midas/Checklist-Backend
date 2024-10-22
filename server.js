const express = require("express");
const PORT = process.env.PORT || 9000;
const session = require("express-session");
const app = express();
const cors = require("cors");
const blogs = require("./src/routes/BlogsRoute");
const disclaimer = require("./src/routes/SeoPagesRoutes/DisclaimerRouter");
const Aboutus = require("./src/routes/SeoPagesRoutes/AboutUsRouter");
const Terms = require("./src/routes/SeoPagesRoutes/termsRouter");
const AuthRouter = require("./src/routes/AuthenticationRouter");
const verifyToken = require("./TokenMiddleware/middleware");
// const parser = require("body-parser");
const bodyParser = require("body-parser");
const docrouter = require("./src/routes/DownloadDocument");
const path = require("path");
const ListRouter = require("./src/routes/consultingRoutes/GetChecklist");
const { cachedRouter } = require("./src/routes/JobsRoutes/GetCachedData");

require("./src/utils/DbConnect");
require("dotenv").config({
  path: "../applicationProperties.env",
});

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

const corsOPt = {
  origin: "*",
  method: "*",
  allowedHeaders: ["*"],
};

app.use(
  session({
    secret: "sessionkey", // Change this to a long, random string
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(parser.json({ limit: "100mb" }));
// var bodyParser = require("body-parser");
// app.use(bodyParser.json({ limit: "500mb" }));
// app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cors(corsOPt));
// app.use(parser.urlencoded({ limit: "100mb", extended: false }));
// Example middleware functions
/* CONSULTING-ROUTES */
app.use("/list", ListRouter);
/* CONSULTING-ROUTES */

// app.use(loggerMiddleware); // Custom logging middleware
// parse application/json

/* AUTHENTICATION */
app.use("/auth", AuthRouter);
/* AUTHENTICATION */

/* SEO PAGES */
app.use("/seo/blog", blogs);
app.use("/seo/disclaimer", disclaimer);
app.use("/seo/about-us", Aboutus);
app.use("/seo/terms-and-condition", Terms);
/* SEO PAGES */
/* GETDOCUMENT */
app.use("/doc/download", docrouter);
app.use("/doc", express.static(path.join(__dirname, "docImages")));
app.use("/checklist", express.static(path.join(__dirname, "images")));
/* GETDOCUMENT */

// app.use(cachedRouter);

app.listen(PORT, () => {
  console.log(`CRM is Ready On ${PORT}`);
});
