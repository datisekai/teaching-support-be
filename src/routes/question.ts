import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();

router.get(
  "",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  QuestionController.getAll
);
router.get(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  QuestionController.getOne
);
router.post(
  "",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  QuestionController.create
);
router.put(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  QuestionController.update
);
router.delete(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  QuestionController.delete
);

export default router;
