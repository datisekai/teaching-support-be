import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();

//Get all users

router.get(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN])],
  UserController.listAll
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   name: Get My Info
 *   description: Get My Info
 * /api.user/me:
 *   get:
 *     summary: Get My Info
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Get My Info successfully
 */
router.get("/me", [checkJwt], UserController.getMyInfo);
router.get("/teacher", [checkJwt], UserController.getAllTeacher);
// Get one user
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.TEACHER])],
  UserController.getOneById
);

//Create a new user
// router.post(
//   "/",
//   [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
//   UserController.newUser
// );
// router.post("/", UserController.newUser);

router.put(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  UserController.editUser
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  UserController.deleteUser
);

router.get(
  "/reset-device/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  UserController.resetDeviceUid
);

export default router;
