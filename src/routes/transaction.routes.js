const exprees = require('express');
const router = exprees.Router();
const transactionController = require('../controllers/tansaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post("/system/initial-fund",authMiddleware.authSystemUserMiddleware,transactionController.createInitianlFundTransaction);

module.exports = router;