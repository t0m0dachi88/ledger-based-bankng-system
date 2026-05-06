const router=require('express').Router();

const authController=require("../controllers/auth.controller")


router.get("/register",authController.register)



module.exports=router