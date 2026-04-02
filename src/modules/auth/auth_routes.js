const express = require("express");
const router = express.Router();
const { register, login } = require("./auth_controller");
const { validateRegister, validateLogin } = require("./auth_validator");

// POST /api/auth/register
router.post("/register", validateRegister, register);

// POST /api/auth/login
router.post("/login", validateLogin, login);

module.exports = router;