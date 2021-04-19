const express = require("express");
const router = express.Router();
const dbConn = require("../lib/db");

router.get("/", (request, response, next) => {
  dbConn.query("SELECT * FROM teachers ORDER BY nip DESC", (error, rows) => {
    if (error) {
      request.flash("error", error);
      response.render("teachers", { data: [] });
    } else {
      response.render("teachers", {
        data: rows,
      });
    }
  });
});

router.get("/add", (request, response) => {
  response.render("teachers/add", {
    nip: "",
    name: "",
    gender: "",
  });
});

router.post("/add", (request, response) => {
  const { nip, name, gender } = request.body;
  let errors = false;
  let errorMesage;

  if (nip.length === 0 || name.length === 0 || gender.length === 0) {
    errors = true;
    if (nip.length === 0) {
      errorMesage = "Please enter nip";
    } else if (name.length === 0) {
      errorMesage = "Please enter teachers name";
    } else if (gender.length === 0) {
      errorMesage = "Please enter gender";
    }

    request.flash("error", errorMesage);
    response.render("teachers/add", {
      nip,
      name,
      gender,
    });
  }

  if (!errors) {
    const formData = {
      nip,
      name,
      gender,
    };

    dbConn.query("INSERT INTO teachers SET ?", formData, (error, result) => {
      if (error) {
        request.flash("error", error);

        response.render("teachers/add", {
          nip,
          name,
          gender,
        });
      } else {
        request.flash("success", "Teachers successfully added");
        response.redirect("/teachers");
      }
    });
  }
});

router.get("/edit/(:nip)", (request, response) => {
  const { nip } = request.params;

  dbConn.query("SELECT * FROM teachers WHERE nip =" + nip, (error, rows) => {
    if (error) throw error;

    if (rows.length <= 0) {
      request.flash("error", "Teachers Not Found");
      response.redirect("/teachers");
    } else {
      response.render("teachers/edit", {
        nip: rows[0].nip,
        name: rows[0].name,
        gender: rows[0].gender,
      });
    }
  });
});

router.post("/update/:nip", (request, response) => {
  const { nip } = request.params;
  const { name, gender } = request.body;
  let errors = false;

  if (nip.length === 0 || name.length === 0 || gender.length === 0) {
    errors = true;
    if (nip.length === 0) {
      errorMesage = "Please enter nip teachers";
    } else if (name.length === 0) {
      errorMesage = "Please enter teachers name";
    } else if (gender.length === 0) {
      errorMesage = "Please enter gender";
    }

    request.flash("error", errorMesage);
    response.render("teachers/edit", {
      nip,
      name,
      gender,
    });
  }

  if (!errors) {
    const formData = {
      nip,
      name,
      gender,
    };

    dbConn.query(
      "UPDATE teachers SET ? WHERE nip =" + nip,
      formData,
      (error, result) => {
        if (error) {
          request.flash("error", error);
          response.render("teachers/edit", {
            nip,
            name,
            gender,
          });
        } else {
          request.flash("success", "Teachers successfully updated");
          response.redirect("/teachers");
        }
      }
    );
  }
});

router.get("/delete/(:nip)", (request, response) => {
  const { nip } = request.params;

  dbConn.query("DELETE FROM teachers WHERE nip =" + nip, (error, result) => {
    if (error) {
      request.flash("error", error);
    } else {
      request.flash("success", "teachers successfully deleted");
    }
    response.redirect("/teachers");
  });
});

module.exports = router;
