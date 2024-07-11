import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";
import CourseController from "../controllers/CourseController";

const router = Router();

//Get all users
router.get("/", [checkJwt], CourseController.listAll);

router.get(
  "/department/:id",
  [checkJwt],
  CourseController.listAllByDepartmentId
);

// Get one course
router.get("/:id([0-9]+)", [checkJwt], CourseController.getOneById);

//Create a new course
router.post(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN])],
  CourseController.newCourse
);

router.put(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  CourseController.editCourse
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  CourseController.deleteCourse
);

export default router;
