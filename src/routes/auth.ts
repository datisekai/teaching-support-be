import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import AuthController from "../controllers/AuthController";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       example:
 *         code: 3120410115
 *         password: 123456
 * tags:
 *   name: Login
 *   description: Login
 * /api.auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Login successfully
 */
router.post("/login", AuthController.login);
router.post("/login-portal", AuthController.loginPortal);

router.post("/check-token", checkJwt, AuthController.checkToken);

//Change my password
// router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
