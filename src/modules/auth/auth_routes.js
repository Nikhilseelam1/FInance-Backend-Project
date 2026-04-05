const express = require("express");
const router = express.Router();
const { register, login } = require("./auth_controller");
const { validateRegister, validateLogin } = require("./auth_validator");

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

module.exports = router;