// api.js

import express from "express";
import {UserControllers} from "../controllers/Users/UsersControllers.js";

const router = express.Router();

router.post("/Registration", UserControllers.Registration);

export default router;
