import { Request, Response } from "express";
import { validate } from "class-validator";
import { myDataSource } from "../app-data-source";
import { Exam } from "../entity/exam.entity";
import { Question } from "../entity/question.entity";
import { CreateExamDto, UpdateExamDto } from "../dto/ExamDto";

export class ExamController {
  static async getAll(req: Request, res: Response) {
    try {
      const examRepository = myDataSource.getRepository(Exam);
      const exams = await examRepository.find({ relations: ["questions"] });
      return res.status(200).json(exams);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching exams" });
    }
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const examRepository = myDataSource.getRepository(Exam);
      const exam = await examRepository.findOne({
        where: {
          id: +id,
        },
        relations: ["questions"],
      });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      return res.status(200).json(exam);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching exam" });
    }
  }

  static async create(req: Request, res: Response) {
    const examRepository = myDataSource.getRepository(Exam);
    const questionRepository = myDataSource.getRepository(Question);
    const createExamDto = new CreateExamDto();
    Object.assign(createExamDto, req.body);

    const errors = await validate(createExamDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const exam = examRepository.create(createExamDto);
      if (createExamDto.questionIds) {
        const questions = await questionRepository.findByIds(
          createExamDto.questionIds
        );
        exam.questions = questions;
      }
      await examRepository.save(exam);
      return res.status(201).json(exam);
    } catch (error) {
      return res.status(500).json({ error: "Error creating exam" });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const examRepository = myDataSource.getRepository(Exam);
    const questionRepository = myDataSource.getRepository(Question);
    const updateExamDto = new UpdateExamDto();
    Object.assign(updateExamDto, req.body);

    const errors = await validate(updateExamDto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let exam = await examRepository.findOne({ where: { id: +id } });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

      if (updateExamDto.questionIds) {
        const questions = await questionRepository.findByIds(
          updateExamDto.questionIds
        );
        exam.questions = questions;
      }

      examRepository.merge(exam, updateExamDto);
      await examRepository.save(exam);
      return res.status(200).json(exam);
    } catch (error) {
      return res.status(500).json({ error: "Error updating exam" });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const examRepository = myDataSource.getRepository(Exam);

    try {
      const exam = await examRepository.findOne({ where: { id: +id } });
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

      await examRepository.remove(exam);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Error deleting exam" });
    }
  }
}
