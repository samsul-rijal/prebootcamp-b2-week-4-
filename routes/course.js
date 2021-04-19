const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

router.get("/", (request, response, next) => {
  dbConn.query(
    "SELECT course.id, course.name, course.schedule, class.name as class_name, teachers.name as teachers_name FROM (course LEFT JOIN class ON course.id_class = class.id_class) LEFT JOIN teachers ON course.nip = teachers.nip ORDER BY id DESC",

    (error, rows) => {
      if (error) {
        request.flash("error", error);
        response.render("course", { data: [] });
      } else {
        response.render("course", {
          data: rows,
        });
      }
    }
  );
});

router.get("/add", (request, response) => {
  response.render("course/add", {
    id: "",
    name: "",
    schedule: "",
    id_class: "",
    nip: "",
  });
});

router.post("/add", (request, response) => {
  const { id, name, schedule, id_class, nip } = request.body;
  let errors = false;
  let errorMesage;

  if (
    name.length === 0 ||
    schedule.length === 0 ||
    id_class.length === 0 ||
    nip.length === 0
  ) {
    errors = true;
    if (name.length === 0) {
      errorMesage = "Please enter course name";
    } else if (schedule.length === 0) {
      errorMesage = "Please enter schedule course";
    } else if (id_class.length === 0) {
      errorMesage = "Please enter class id";
    } else if (nip.length === 0) {
      errorMesage = "Please enter teacher nip";
    }

    request.flash("error", errorMesage);
    response.render("course/add", {
      id,
      name,
      schedule,
      id_class,
      nip,
    });
  }

  if (!errors) {
    const formData = {
      id,
      name,
      schedule,
      id_class,
      nip,
    };

    dbConn.query("INSERT INTO course SET ?", formData, (error, result) => {
      if (error) {
        request.flash("error", error);

        response.render("course/add", {
          id,
          name,
          schedule,
          id_class,
          nip,
        });
      } else {
        request.flash("success", "Course successfully added");
        response.redirect("/course");
      }
    });
  }
});

router.get("/edit/(:id)", (request, response) => {
  const { id } = request.params;

  dbConn.query("SELECT * FROM course WHERE id =" + id, (error, rows) => {
    if (error) throw error;

    if (rows.length <= 0) {
      request.flash("error", "Course Not Found");
      response.redirect("/course");
    } else {
      response.render("course/edit", {
        id: rows[0].id,
        name: rows[0].name,
        schedule: rows[0].schedule,
        id_class: rows[0].id_class,
        nip: rows[0].nip,
      });
    }
  });
});

router.post("/update/:id", (request, response) => {
  const { id } = request.params;
  const { name, schedule, id_class, nip } = request.body;
  let errors = false;

  if (
    name.length === 0 ||
    schedule.length === 0 ||
    id_class.length === 0 ||
    nip.length === 0
  ) {
    errors = true;
    if (name.length === 0) {
      errorMesage = "Please enter course name";
    } else if (schedule.length === 0) {
      errorMesage = "Please enter schedule course";
    } else if (id_class.length === 0) {
      errorMesage = "Please enter class id";
    } else if (nip.length === 0) {
      errorMesage = "Please enter nip";
    }

    request.flash("error", errorMesage);
    response.render("course/edit", {
      id,
      name,
      schedule,
      id_class,
      nip,
    });
  }

  if (!errors) {
    const formData = {
      id,
      name,
      schedule,
      id_class,
      nip,
    };

    dbConn.query(
      "UPDATE course SET ? WHERE id =" + id,
      formData,
      (error, result) => {
        if (error) {
          request.flash("error", error);
          response.render("course/edit", {
            id,
            name,
            schedule,
            id_class,
            nip,
          });
        } else {
          request.flash("success", "Course successfully updated");
          response.redirect("/course");
        }
      }
    );
  }
});

router.get("/delete/(:id)", (request, response) => {
  const { id } = request.params;

  dbConn.query("DELETE FROM course WHERE id =" + id, (error, result) => {
    if (error) {
      request.flash("error", error);
    } else {
      request.flash("success", "Course successfully deleted");
    }
    response.redirect("/course");
  });
});

module.exports = router;
