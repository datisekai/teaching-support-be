import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";
import DepartmentController from "../controllers/DepartmentController";

const router = Router();

//Get all users
router.get("/", [checkJwt], DepartmentController.listAll);

// Get one user
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.TEACHER, UserRole.ADMIN])],
  DepartmentController.getOneById
);

//Create a new user
router.post(
  "/",
  [checkJwt, checkRole([UserRole.ADMIN])],
  DepartmentController.newDepartment
);
// router.post("/", UserController.newUser);

router.put(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  DepartmentController.editDepartment
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole([UserRole.ADMIN])],
  DepartmentController.deleteDepartment
);

export default router;
