const express = require("express");
const router = express.Router();
const {
  getUserTasks,
  createNewTask,
  checkTask,
  changeTaskName,
  deleteTask,
  sendQRCodeEmail,
} = require("../controllers/taskController");

router.route("/").get(getUserTasks).post(createNewTask);
router.route("/:taskId").get(checkTask).put(changeTaskName).delete(deleteTask);
router.route("/email/:taskId").post(sendQRCodeEmail);

module.exports = router;
