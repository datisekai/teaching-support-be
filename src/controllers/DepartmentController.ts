import { validate } from "class-validator";
import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { DepartmentDto } from "../dto/DepartmentDto";
import { Department } from "../entity/department.entity";
import { Course } from "../entity/course.entity";

class DepartmentController {
  static listAll = async (req: Request, res: Response) => {
    const departmentRepository = myDataSource.getRepository(Department);
    const departments = await departmentRepository.find({
      where: {
        is_deleted: false,
      },
      order: {
        created_at: "DESC",
      },
    });

    res.send({
      message: "success",
      data: departments,
    });
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    const departmentRepository = myDataSource.getRepository(Department);
    try {
      const department = await departmentRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
        relations: {
          courses: true,
        },
      });
      res.send({
        success: true,
        data: department,
      });
    } catch (error) {
      res.status(404).send({ message: "Department not found", success: false });
    }
  };

  static newDepartment = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { name, description } = req.body;
    let department = new DepartmentDto();
    department.description = description || "";
    department.name = name;

    //Validade if the parameters are ok
    const errors = await validate(department);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to save. If fails, the email is already in use
    const departmentRepository = myDataSource.getRepository(Department);
    try {
      const departmentSaved = await departmentRepository.save(department);
      //If all ok, send 201 response
      res.status(201).send({
        success: true,
        message: "Department created",
        data: departmentSaved,
      });
    } catch (e) {
      res
        .status(409)
        .send({ success: false, message: "create department failed" });
      return;
    }
  };

  static editDepartment = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    //Get values from the body
    const { name, description } = req.body;

    //Try to find user on database
    const departmentRepository = myDataSource.getRepository(Department);
    let department;
    try {
      department = await departmentRepository.findOneOrFail({
        where: {
          id,
          is_deleted: false,
        },
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send({ success: false, message: "Department not found" });
      return;
    }

    department.name = name || department.name;
    department.description = description || department.description;

    const errors = await validate(department);
    if (errors.length > 0) {
      res.status(400).send({ success: false, errors });
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await departmentRepository.save(department);
    } catch (e) {
      res.status(409).send({ success: false, message: "existed error" });
      return;
    }
    res
      .status(200)
      .send({ success: true, message: "Department edited", data: department });
  };

  static deleteDepartment = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = +req.params.id;

    const departmentRepository = myDataSource.getRepository(Department);
    const courseRepository = myDataSource.getRepository(Course);
    let department: Department;

    try {
      department = await departmentRepository.findOneOrFail({
        where: { id, is_deleted: false },
      });
      const courses = await courseRepository.find({
        where: {
          department_id: department.id,
          is_deleted: false,
        },
      });
      if (courses && courses.length > 0) {
        return res
          .status(409)
          .send({ success: false, message: "Department has courses" });
      }
    } catch (error) {
      res.status(404).send({ success: false, message: "Department not found" });
      return;
    }
    department.is_deleted = true;
    await departmentRepository.save(department);

    res.status(200).send({ success: true, message: "Department deleted" });
  };
}

export default DepartmentController;
