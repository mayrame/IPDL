const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");

router.get("/login", authController.login);
router.post("/login", authController.authenticate);
router.get("/logout", authController.logout);
router.get("/signup", authController.signup);
router.post("/signup", authController.register, usersController.redirectView);

module.exports = router;