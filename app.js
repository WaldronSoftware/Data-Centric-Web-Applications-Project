const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const mysql = require("mysql2");
const url = "mongodb://0.0.0.0:27017/employeesDB";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.set("strictQuery", true);

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, db) {
    if (err) {
      console.log("Error Connecting to Mongo DB");
    } else {
      console.log("Mongo Database Connected!");
    }
  }
);

const conMongo = mongoose.connection;

var con = mysql.createConnection({
  host: "localhost",
  user: "User Your Username",
  password: "Use your Password",
  database: "proj2022",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("MySQL Database Connected!");
});

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.get("/employees", function (req, res) {
  res.sendFile(path.join(__dirname + "/employees/employee.html"));
});

router.get("/departments", function (req, res) {
  res.sendFile(path.join(__dirname + "/departments/departments.html"));
});

router.get("/employeesmongo", function (req, res) {
  res.sendFile(path.join(__dirname + "/employeesmongo/employeesmongo.html"));
});

router.get("/employeemongo/add", function (req, res) {
  res.sendFile(path.join(__dirname + "/employeesmongo/addemployee.html"));
});

router.get("/employee/edit", function (req, res) {
  res.sendFile(path.join(__dirname + "/employees/editemployee.html"));
});

router.get("/department/delete", function (req, res) {
  res.sendFile(path.join(__dirname + "/departments/deletedepartment.html"));
});

const Employee = mongoose.model(
  "employees",
  Schema({
    _id: String,
    phone: String,
    email: String,
  })
);

router.get("/getEmployeesMongo", async function (req, res) {
  const filter = {};
  const employees = await Employee.find(filter);
  res.send({ Employees: employees });
});

router.post("/addEmployeeMongo", async function (req, res) {
  await Employee.create(
    {
      _id: req.body._id,
      phone: req.body.phone,
      email: req.body.email,
    },
    function (err, response) {
      if (err) return err;

      res.status(200).send("Employee Successfully Inserted");
    }
  );
});

router.get("/getEmployeesMySQL", function (req, res) {
  con.query("SELECT * FROM employee", function (err, employees) {
    if (err) return err;

    res.status(200).send({ Employees: employees });
  });
});

router.put("/updateEmployeesMySQL", function (req, res) {
  console.log(req.body);
  con.query(
    "update employee set ename = ?, role= ?, salary=? where eid = ?",
    [req.body.ename, req.body.role, req.body.salary, req.body.eid],
    function (err, employee) {
      if (err) {
        console.log(err);
        return err;
      }

      res.status(200).send({
        Message: "Employee Updated Successfully",
        Employees: employee,
      });
    }
  );
});

router.get("/getDepartmentsMySQL", function (req, res) {
  con.query(
    "SELECT did, dname, county, budget FROM dept inner join location on dept.lid = location.lid",
    function (err, departments) {
      if (err) return err;

      res.status(200).send({ Departments: departments });
    }
  );
});

router.delete("/deleteDepartmentsMySQL", function (req, res) {
  con.query("Delete FROM dept where did=?", [req.params.did], function (
    err,
    department
  ) {
    if (err) return err;

    res.status(200).send({
      Message: "Department Successfully Deleted",
      Department: department,
    });
  });
});

app.use("/", router);

const port = process.env.port || 3000;

app.listen(port, function (err) {
  if (err) console.log("Error in server setup");
  console.log(`Server listening on port ${port}`);
});
