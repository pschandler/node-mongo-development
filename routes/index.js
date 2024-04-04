var express = require("express");
var Task = require("../models/task");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // console.log("index: ");
  // res.render("index");
  Task.find()
    .then((tasks) => {
      const currentTasks = tasks.filter((task) => !task.completed);
      const completedTasks = tasks.filter((task) => task.completed === true);
      console.log(
        `Total tasks: ${tasks.length}   Current tasks: ${currentTasks.length}    Completed tasks:  ${completedTasks.length}`
      );
      res.render("index", {
        currentTasks: currentTasks,
        completedTasks: completedTasks,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

router.post("/addTask", function (req, res, next) {
  console.log("AddTask: ");
  const taskName = req.body.taskName;
  const createDate = "2024-03-30T14:51:25.815+00:00";

  var task = new Task({
    taskName: taskName,
    createDate: createDate,
  });
  console.log(`Adding a new task ${taskName} - createDate ${createDate}`);

  task
    .save()
    .then(() => {
      console.log(`Added new task ${taskName} - createDate ${createDate}`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

router.post("/completeTask", function (req, res, next) {
  console.log("I am in the PUT method");
  const taskId = req.body._id;
  const completedDate = "2024-03-30T14:51:25.815+00:00";

  Task.findByIdAndUpdate(taskId, {
    completed: true,
    completedDate: completedDate,
  })
    .then(() => {
      console.log(`Completed task ${taskId}`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

router.post("/deleteTask", function (req, res, next) {
  const taskId = req.body._id;
  const completedDate = "2024-03-30T14:51:25.815+00:00"; //Date.now();
  Task.findByIdAndDelete(taskId)
    .then(() => {
      console.log(`Deleted task $(taskId)`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

module.exports = router;
