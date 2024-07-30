import { validate } from "class-validator";
import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { DepartmentDto } from "../dto/DepartmentDto";
import { Department } from "../entity/department.entity";
import { Course } from "../entity/course.entity";
import { CourseDto } from "../dto/CourseDto";

class CourseController {
  static listAll = async (req: Request, res: Response) => {
    const courseRepository = myDataSource.getRepository(Course);
    const courses = await courseRepository.find({
      where: {
        is_deleted: false,
      },
      relations: ["department"],
      order: {
        created_at: "DESC",
      },
    });

    res.send({
      message: "success",
      data: courses,
    });
  };

  static listAllByDepartmentId = async (req: Request, res: Response) => {
    const courseRepository = myDataSource.getRepository(Course);
    const courses = await courseRepository.find({
      where: {
        department_id: +req.params.id,
        is_deleted: false,
      },
      relations: ["department"],
    });

    res.send({ message: "success", data: courses });
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    const courseRepository = myDataSource.getRepository(Course);
    try {
      const course = await courseRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
        relations: ["department", "groups"],
      });
      res.send({
        success: true,
        data: course,
      });
    } catch (error) {
      res.status(404).send({ message: "Course not found", success: false });
    }
  };

  static newCourse = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { name, description, department_id, code } = req.body;
    let course = new CourseDto();
    course.description = description || "";
    course.name = name;
    course.department_id = department_id;
    course.code = code;

    //Validade if the parameters are ok
    const errors = await validate(course);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to save. If fails, the email is already in use
    const courseRepository = myDataSource.getRepository(Course);
    try {
      const courseSaved = await courseRepository.save(course);

      //If all ok, send 201 response
      res.status(201).send({
        success: true,
        message: "Department created",
        data: courseSaved,
      });
    } catch (e) {
      res.status(409).send({ success: false, message: "create course failed" });
      return;
    }
  };

  static editCourse = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    //Get values from the body
    const { name, description, department_id, code } = req.body;

    //Try to find user on database
    const courseRepository = myDataSource.getRepository(Course);
    let course;
    try {
      course = await courseRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({ success: false, message: "Course not found" });
      return;
    }

    course.name = name || course.name;
    course.description = description || course.description;
    course.department_id = department_id || course.department_id;
    course.code = code || course.code;

    const errors = await validate(course);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await courseRepository.save(course);
    } catch (e) {
      res.status(409).send({ success: false, message: "existed error" });
      return;
    }
    res
      .status(200)
      .send({ success: true, message: "Course edited", data: course });
  };

  static deleteCourse = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    const courseRepository = myDataSource.getRepository(Course);
    let course: Course;
    try {
      course = await courseRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "course not found" });
      return;
    }
    course.is_deleted = true;
    await courseRepository.save(course);

    res.status(200).send({ success: true, message: "course deleted" });
  };
}

export default CourseController;
