import { Router } from "express";
import { ExamController } from "../controllers/ExamController";

const router = Router();

router.get("", ExamController.getAll);
router.get("/:id", ExamController.getOne);
router.post("", ExamController.create);
router.put("/:id", ExamController.update);
router.delete("/:id", ExamController.delete);

export default router;
