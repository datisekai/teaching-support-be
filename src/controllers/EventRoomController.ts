import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { EventRoom } from "../entity/event-room.entity";

class EventRoomController {
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
    const eventRoomRepository = myDataSource.getRepository(EventRoom);
    try {
      const events = await eventRoomRepository.find({
        where: {
          student_id: userId,
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
}

export default EventRoomController;
