const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

router.get("/", (request, response, next) => {
  dbConn.query("SELECT * FROM students ORDER BY nis DESC", (error, rows) => {
    if (error) {
      request.flash("error", error);
      response.render("students", { data: [] });
    } else {
      response.render("students", {
        data: rows,
      });
    }
  });
});

router.get("/add", (request, response) => {
  response.render("students/add", {
    nis: "",
    name: "",
    gender: "",
  });
});

router.post("/add", (request, response) => {
  const { nis, name, gender } = request.body;
  let errors = false;
  let errorMesage;

  if (nis.length === 0 || name.length === 0 || gender.length === 0) {
    errors = true;
    if (nis.length === 0) {
      errorMesage = "Please enter nis";
    } else if (name.length === 0) {
      errorMesage = "Please enter students name";
    } else if (gender.length === 0) {
      errorMesage = "Please enter gender";
    }

    request.flash("error", errorMesage);
    response.render("students/add", {
      nis,
      name,
      gender,
    });
  }

  if (!errors) {
    const formData = {
      nis,
      name,
      gender,
    };

    dbConn.query("INSERT INTO students SET ?", formData, (error, result) => {
      if (error) {
        request.flash("error", error);

        response.render("students/add", {
          nis,
          name,
          gender,
        });
      } else {
        request.flash("success", "Students successfully added");
        response.redirect("/students");
      }
    });
  }
});

router.get("/edit/(:nis)", (request, response) => {
  const { nis } = request.params;

  dbConn.query("SELECT * FROM students WHERE nis =" + nis, (error, rows) => {
    if (error) throw error;

    if (rows.length <= 0) {
      request.flash("error", "Students Not Found");
      response.redirect("/students");
    } else {
      response.render("students/edit", {
        nis: rows[0].nis,
        name: rows[0].name,
        gender: rows[0].gender,
      });
    }
  });
});

router.post("/update/:nis", (request, response) => {
  const { nis } = request.params;
  const { name, gender } = request.body;
  let errors = false;

  if (nis.length === 0 || name.length === 0 || gender.length === 0) {
    errors = true;
    if (nis.length === 0) {
      errorMesage = "Please enter nis students";
    } else if (name.length === 0) {
      errorMesage = "Please enter students name";
    } else if (gender.length === 0) {
      errorMesage = "Please enter gender";
    }

    request.flash("error", errorMesage);
    response.render("students/edit", {
      nis,
      name,
      gender,
    });
  }

  if (!errors) {
    const formData = {
      nis,
      name,
      gender,
    };

    dbConn.query(
      "UPDATE students SET ? WHERE nis =" + nis,
      formData,
      (error, result) => {
        if (error) {
          request.flash("error", error);
          response.render("students/edit", {
            nis,
            name,
            gender,
          });
        } else {
          request.flash("success", "Students successfully updated");
          response.redirect("/students");
        }
      }
    );
  }
});

router.get("/delete/(:nis)", (request, response) => {
  const { nis } = request.params;

  dbConn.query("DELETE FROM students WHERE nis =" + nis, (error, result) => {
    if (error) {
      request.flash("error", error);
    } else {
      request.flash("success", "Students successfully deleted");
    }
    response.redirect("/students");
  });
});

module.exports = router;
