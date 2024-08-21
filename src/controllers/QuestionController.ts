import { Request, Response } from "express";
import { validate } from "class-validator";
import { myDataSource } from "../app-data-source";
import { Question } from "../entity/question.entity";
import { CreateQuestionDto, UpdateQuestionDto } from "../dto/QuestionDto";

export class QuestionController {
  static async getAll(req: Request, res: Response) {
    try {
      const questionRepository = myDataSource.getRepository(Question);
      const questions = await questionRepository.find();
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching questions" });
    }
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const questionRepository = myDataSource.getRepository(Question);
      const question = await questionRepository.findOne({ where: { id: +id } });
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.status(200).json(question);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching question" });
    }
  }

  static async create(req: Request, res: Response) {
    const questionRepository = myDataSource.getRepository(Question);
    const createQuestionDto = new CreateQuestionDto();
    Object.assign(createQuestionDto, req.body);

    const errors = await validate(createQuestionDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const question = questionRepository.create(createQuestionDto);
      await questionRepository.save(question);
      return res.status(201).json(question);
    } catch (error) {
      return res.status(500).json({ error: "Error creating question" });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const questionRepository = myDataSource.getRepository(Question);
    const updateQuestionDto = new UpdateQuestionDto();
    Object.assign(updateQuestionDto, req.body);

    const errors = await validate(updateQuestionDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let question = await questionRepository.findOne({ where: { id: +id } });
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      questionRepository.merge(question, updateQuestionDto);
      await questionRepository.save(question);
      return res.status(200).json(question);
    } catch (error) {
      return res.status(500).json({ error: "Error updating question" });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const questionRepository = myDataSource.getRepository(Question);

    try {
      const question = await questionRepository.findOne({ where: { id: +id } });
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      await questionRepository.remove(question);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Error deleting question" });
    }
  }
}
