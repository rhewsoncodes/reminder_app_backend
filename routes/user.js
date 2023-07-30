const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
  .route("/")
  .get(userController.getUserDetails)
  .post(userController.handleNewUser);
router.put("/vacation", userController.toggleVacation);

module.exports = router;
