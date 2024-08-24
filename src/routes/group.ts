import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";
import GroupController from "../controllers/GroupController";

const router = Router();

//Get all users
router.get("/", [checkJwt], GroupController.listAll);

router.get("/course/:id", [checkJwt], GroupController.listAllByCourseId);

// Get one course
router.get("/:id([0-9]+)", [checkJwt], GroupController.getOneById);

// Get all course
router.get(
  "/students/:id([0-9]+)",
  [checkJwt],
  GroupController.listAllUserByCourseId
);

//Create a new course
router.post(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN])],
  GroupController.newGroup
);

router.put(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  GroupController.editGroup
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  GroupController.deleteGroup
);
router.post(
  "/import/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.TEACHER])],
  GroupController.createStudentsByGroupId
);

export default router;
