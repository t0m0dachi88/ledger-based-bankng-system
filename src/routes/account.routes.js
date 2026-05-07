const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/create-account", authMiddleware.authMiddleware, accountController.createAccount);
router.get("/my-account", authMiddleware.authMiddleware, accountController.getUserAccount);

module.exports = router;