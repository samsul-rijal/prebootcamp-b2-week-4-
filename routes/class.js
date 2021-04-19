const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

router.get("/", (request, response, next) => {
  dbConn.query(
    "SELECT class.id_class, class.name, students.name as students_name FROM class LEFT JOIN students ON class.nis_students = students.nis ORDER BY id_class DESC",
    (error, rows) => {
      if (error) {
        request.flash("error", error);
        response.render("class", { data: [] });
      } else {
        response.render("class", {
          data: rows,
        });
      }
    }
  );
});

router.get("/add", (request, response) => {
  response.render("class/add", {
    id_class: "",
    name: "",
    nis_students: "",
  });
});

router.post("/add", (request, response) => {
  const { id_class, name, nis_students } = request.body;
  let errors = false;
  let errorMesage;

  if (id_class.length === 0 || name.length === 0 || nis_students.length === 0) {
    errors = true;
    if (id_class.length === 0) {
      errorMesage = "Please enter class id";
    } else if (name.length === 0) {
      errorMesage = "Please enter student name";
    } else if (nis_students.length === 0) {
      errorMesage = "Please enter student nis";
    }

    request.flash("error", errorMesage);
    response.render("class/add", {
      id_class,
      name,
      nis_students,
    });
  }

  if (!errors) {
    const formData = {
      id_class,
      name,
      nis_students,
    };

    dbConn.query("INSERT INTO class SET ?", formData, (error, result) => {
      if (error) {
        request.flash("error", error);

        response.render("class/add", {
          id_class,
          name,
          nis_students,
        });
      } else {
        request.flash("success", "Class successfully added");
        response.redirect("/class");
      }
    });
  }
});

router.get("/edit/(:id_class)", (request, response) => {
  const { id_class } = request.params;

  dbConn.query(
    "SELECT * FROM class WHERE id_class =" + id_class,
    (error, rows) => {
      if (error) throw error;

      if (rows.length <= 0) {
        request.flash("error", "Class Not Found");
        response.redirect("/class");
      } else {
        response.render("class/edit", {
          id_class: rows[0].id_class,
          name: rows[0].name,
          nis_students: rows[0].nis_students,
        });
      }
    }
  );
});

router.post("/update/:id_class", (request, response) => {
  const { id_class } = request.params;
  const { name, nis_students } = request.body;
  let errors = false;

  if (id_class.length === 0 || name.length === 0 || nis_students.length === 0) {
    errors = true;
    if (id_class.length === 0) {
      errorMesage = "Please enter class id";
    } else if (name.length === 0) {
      errorMesage = "Please enter students name";
    } else if (nis_students.length === 0) {
      errorMesage = "Please enter students nis";
    }

    request.flash("error", errorMesage);
    response.render("class/edit", {
      id_class,
      name,
      nis_students,
    });
  }

  if (!errors) {
    const formData = {
      id_class,
      name,
      nis_students,
    };

    dbConn.query(
      "UPDATE class SET ? WHERE id_class =" + id_class,
      formData,
      (error, result) => {
        if (error) {
          request.flash("error", error);
          response.render("class/edit", {
            id_class,
            name,
            nis_students,
          });
        } else {
          request.flash("success", "Class successfully updated");
          response.redirect("/class");
        }
      }
    );
  }
});

router.get("/delete/(:id_class)", (request, response) => {
  const { id_class } = request.params;

  dbConn.query(
    "DELETE FROM class WHERE id_class =" + id_class,
    (error, result) => {
      if (error) {
        request.flash("error", error);
      } else {
        request.flash("success", "Class successfully deleted");
      }
      response.redirect("/class");
    }
  );
});

module.exports = router;
