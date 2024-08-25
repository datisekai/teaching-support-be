import { Router } from "express";
import { ExamController } from "../controllers/ExamController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../dto/UserDto";

const router = Router();

router.get(
  "",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  ExamController.getAll
);
router.get(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  ExamController.getOne
);
router.post(
  "",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  ExamController.create
);
router.put(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  ExamController.update
);
router.delete(
  "/:id",
  [checkJwt, checkRole([UserRole.ADMIN, UserRole.TEACHER])],
  ExamController.delete
);

router.get("/user/history", [checkJwt], ExamController.getHistory);

router.get("/user/:code", [checkJwt], ExamController.findByCode);
router.get("/user/get-exam/:id", [checkJwt], ExamController.findByIdForUser);
router.post("/user/take-exam/:id", [checkJwt], ExamController.takeExam);

export default router;
