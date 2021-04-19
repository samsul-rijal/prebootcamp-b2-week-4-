const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./lib/db");
const expressFlash = require("express-flash");
const session = require("express-session");

const indexRouter = require("./routes/index");

const studentsRouter = require("./routes/students");
const classRouter = require("./routes/class");
const teachersRouter = require("./routes/teachers");
const courseRouter = require("./routes/course");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    cookie: {
      maxAge: 60000,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: "true",
    secret: "secret",
  })
);

app.use(expressFlash());

app.use("/", indexRouter);
app.use("/students", studentsRouter);
app.use("/class", classRouter);
app.use("/teachers", teachersRouter);
app.use("/course", courseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;