import { FindOneOptions } from "typeorm";
import { myDataSource } from "../app-data-source";
import { Item } from "../entity/item.entity";
import { Player } from "../entity/player.entity";

export class PlayerService {
  static getOne = async (query: FindOneOptions<Player>) => {
    const playerRepository = myDataSource.getRepository(Player);
    return playerRepository.findOne(query);
  };
  static newPlayer = async (
    name: string,
    phone: string,
    email: string,
    campaign_id: number
  ) => {
    try {
      const playerRepository = myDataSource.getRepository(Player);
      const player = new Player();
      player.name = name;
      player.phone = phone;
      player.email = email;
      player.campaign_id = campaign_id;
      await playerRepository.save(player);
      return player;
    } catch (error) {
      return false;
    }
  };
}
