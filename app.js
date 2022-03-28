const express = require("express");
const cors = require("cors");
const path = require("path");

// Required Routes
const userRoutes = require("./api/users/users.routes");
const courseRoutes = require("./api/courses/courses.routes");
const profileRoutes = require("./api/profiles/profiles.routes");
const connectDB = require("./db/database");

const app = express();
//middleware

app.use(express.json());

//return all trips

// Required Middlewares
const logger = require("./middleware/logger");
const { errorHandler, routerNotFound } = require("./middleware/errorHandler");
const passport = require("passport");

//Required Passport
const { localStrategy, jwtStrategy } = require("./middleware/passport");

//middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(errorHandler);
app.use("/media", express.static(path.join(__dirname, "media")));
// app.use(routerNotFound);

//initializing passport for to check sign In
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

//middleware hundel Errors

// Routes
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/profiles", profileRoutes);

//server use

connectDB();

app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
