import { Request, Response } from "express";
import { myDataSource } from "../app-data-source";
import { Room } from "../entity/room.entity";
import { EventRoom } from "../entity/event-room.entity";
import dayjs from "dayjs";
class StatisticController {
  static listStatisticByRoomId = async (req: Request, res: Response) => {
    const roomId = +req.params.id;
    const eventRoomRepository = myDataSource.getRepository(EventRoom);
    const roomRepository = myDataSource.getRepository(Room);

    try {
      // Lấy thông tin room
      const room = await roomRepository.findOne({
        where: { id: roomId },
        relations: ["group", "group.members"],
      });

      if (!room) {
        return res
          .status(404)
          .send({ message: "Room not found", success: false });
      }
      const roomCreationDate = dayjs(room.created_at);

      const totalStudents = room.group.members.length; // Tổng số sinh viên trong lớp

      // Tính ngày hôm nay từ 00:00 đến 23:59
      const todayStart = roomCreationDate.startOf("day").toDate();
      const todayEnd = roomCreationDate.endOf("day").toDate();

      // Đếm số sinh viên đã điểm danh trong ngày hôm nay
      const checkedInCount = await eventRoomRepository
        .createQueryBuilder("eventRoom")
        .where("eventRoom.room_id = :roomId", { roomId })
        .andWhere("eventRoom.success = true")
        .andWhere("eventRoom.created_at BETWEEN :start AND :end", {
          start: todayStart,
          end: todayEnd,
        })
        .getCount();

      // Số sinh viên chưa điểm danh
      const notCheckedInCount = totalStudents - checkedInCount;

      // Tỉ lệ sinh viên đi học và nghỉ học
      const attendanceRate = ((checkedInCount / totalStudents) * 100).toFixed(
        2
      );
      const absenceRate = ((notCheckedInCount / totalStudents) * 100).toFixed(
        2
      );

      const events = await eventRoomRepository.find({
        where: {
          room_id: +req.params.id,
        },
        relations: ["student"],
      });

      // Trả về kết quả
      return res.send({
        message: "success",
        data: {
          checkedInCount, // Số sinh viên đã điểm danh
          notCheckedInCount, // Số sinh viên chưa điểm danh
          attendanceRate: `${attendanceRate}%`, // Tỉ lệ sinh viên đi học
          absenceRate: `${absenceRate}%`, // Tỉ lệ sinh viên nghỉ học
          listUser: events,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Error retrieving data", success: false });
    }
  };
}

export default StatisticController;
