import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { EventRoom } from "../entity/event-room.entity";
import dayjs from "dayjs";
import { Between } from "typeorm";

class EventRoomController {
  static listAllSuccessByRoomId = async (req: Request, res: Response) => {
    const eventRoomRepository = myDataSource.getRepository(EventRoom);
    try {
      const events = await eventRoomRepository.find({
        where: {
          room_id: +req.params.id,
          success: true,
        },
        relations: ["room", "student"],
      });

      return res.send({
        success: true,
        data: events,
      });
    } catch (error) {
      return res
        .status(404)
        .send({ message: "Event room not found", success: false });
    }
  };

  static listAllByRoomId = async (req: Request, res: Response) => {
    const eventRoomRepository = myDataSource.getRepository(EventRoom);
    try {
      const events = await eventRoomRepository.find({
        where: {
          room_id: +req.params.id,
        },
        relations: ["room", "student"],
      });

      return res.send({
        success: true,
        data: events,
      });
    } catch (error) {
      return res
        .status(404)
        .send({ message: "Event room not found", success: false });
    }
  };

  static listAllMyEventRoom = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.id;
    const { date } = req.query;
    const eventRoomRepository = myDataSource.getRepository(EventRoom);

    if (typeof date !== "string") {
      return res
        .status(400)
        .send({ message: "Invalid date format", success: false });
    }

    try {
      const targetDate = dayjs(date).startOf("day").toDate();
      const nextDate = dayjs(date).endOf("day").toDate();

      if (!targetDate || !nextDate || !dayjs(date).isValid()) {
        return res
          .status(400)
          .send({ message: "Invalid date", success: false });
      }

      const events = await eventRoomRepository.find({
        where: {
          student_id: userId,
          success: true,
          created_at: Between(targetDate, nextDate), // Filter theo ngày
        },
        relations: {
          room: {
            group: {
              course: {
                department: true,
              },
              teacher: true,
            },
          },
          student: true,
        },
        order: {
          created_at: "DESC",
        },
      });

      return res.send({
        success: true,
        data: events,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Error retrieving events", success: false });
    }
  };
}

export default EventRoomController;
