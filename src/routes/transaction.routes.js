const exprees = require('express');
const router = exprees.Router();
const transactionController = require('../controllers/tansaction.model');
const authMiddleware = require('../middlewares/auth.middleware');
router.post("/",authMiddleware,transactionController.createNewTransaction);

module.exports = router;