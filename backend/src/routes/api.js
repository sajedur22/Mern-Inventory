// api.js

import express from "express";
import {UserControllers} from "../controllers/Users/UsersControllers.js";
import {BranController} from "../controllers/brand/BrandControlller.js"
import AuthVerifyMiddleware from "../middlewares/AuthVerifyMiddleware.js";

const router = express.Router();

router.post("/Registration", UserControllers.Registration);
router.post("/Login", UserControllers.Login);
router.post("/ProfileUpdate",AuthVerifyMiddleware,UserControllers.ProfileUpdate);
router.get("/ProfileDetails",AuthVerifyMiddleware,UserControllers.ProfileDetails);
router.get("/RecoverVerifyEmail/:email",UserControllers.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",UserControllers.RecoverVerifyOTP);
router.post("/RecoverResetPass",UserControllers.RecoverResetPass);
export default router;


// Brands
router.post("/CreateBrand",AuthVerifyMiddleware,BranController.CreateBrand);
router.post("/UpdateBrand/:id",AuthVerifyMiddleware,BranController.UpdateBrand);