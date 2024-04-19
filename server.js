const express = require("express");
const PORT = process.env.PORT || 9000;
const app = express();
const cors = require("cors");
const blogs = require("./src/routes/BlogsRoute");
const disclaimer = require("./src/routes/SeoPagesRoutes/DisclaimerRouter");
const Aboutus = require("./src/routes/SeoPagesRoutes/AboutUsRouter");
const Terms = require("./src/routes/SeoPagesRoutes/termsRouter");
const AuthRouter = require("./src/routes/AuthenticationRouter");
const verifyToken = require("./TokenMiddleware/middleware");
const parser = require("body-parser");
const docrouter = require("./src/routes/DownloadDocument");
const path = require("path");
const ListRouter = require("./src/routes/consultingRoutes/GetChecklist");
const { cachedRouter } = require("./src/routes/JobsRoutes/GetCachedData");

require("./src/utils/DbConnect");
require("dotenv").config({
  path: "../applicationProperties.env",
});

const corsOPt = {
  origin: "*",
  method: "*",
  allowedHeaders: ["*"],
};
app.use(parser.urlencoded({ limit: "100mb", extended: false }));

// parse application/json
app.use(parser.json({ limit: "100mb" }));
app.use(cors(corsOPt));

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

/* CONSULTING-ROUTES */
app.use("/list", ListRouter);
/* CONSULTING-ROUTES */

app.use(cachedRouter);

app.listen(PORT, () => {
  console.log(`CRM is Ready On ${PORT}`);
});
