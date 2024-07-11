import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import AuthController from "../controllers/AuthController";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
// router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
