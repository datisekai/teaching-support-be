import { FindOneOptions } from "typeorm";
import { myDataSource } from "../app-data-source";
import { Room } from "../entity/room.entity";
import { ColyseusService } from "./ColyseusService";
import { RoomStatus } from "../dto/RoomDto";
import config from "../config/config";
import axios from "axios";

export class AuthService {
  static getInfoTTDT = async (token: string) => {
    const url = `${config.ttdtUrl}/public/api/dkmh/w-locsinhvieninfo`;
    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return null;
    }
  };
  static loginTTDT = async (code: string, password: string) => {
    const url = `${config.ttdtUrl}/api/auth/login`;
    try {
      const payload = { username: code, password, grant_type: "password" };
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
      return "";
    }
  };

  static getImageTTDT = async (token: string, code: string) => {
    const url = `${config.ttdtUrl}/public/api/sms/w-locthongtinimagesinhvien?MaSV=${code}`;
    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.thong_tin_sinh_vien;
    } catch (error) {
      return null;
    }
  };

  static getInformation = async (code: string, password: string) => {
    try {
      const { access_token, roles } = await this.loginTTDT(code, password);
      const info = await this.getInfoTTDT(access_token);
      const image = await this.getImageTTDT(access_token, code);

      if (!access_token || !roles || !info || !image) {
        return null;
      }

      return { ...info, image: image?.image ?? "", roles };
    } catch (error) {
      return null;
    }
  };
}
