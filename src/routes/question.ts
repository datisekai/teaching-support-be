import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";

const router = Router();

router.get("", QuestionController.getAll);
router.get("/:id", QuestionController.getOne);
router.post("", QuestionController.create);
router.put("/:id", QuestionController.update);
router.delete("/:id", QuestionController.delete);

export default router;
