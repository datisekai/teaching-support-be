import { FindOneOptions } from "typeorm";
import { myDataSource } from "../app-data-source";
import { Reward } from "../entity/reward.entity";
import { ItemService } from "./ItemService";
import { PlayerService } from "./PlayerService";

export class RewardService {
  static getOne = async (query: FindOneOptions<Reward>) => {
    const rewardRepository = myDataSource.getRepository(Reward);
    return rewardRepository.findOne(query);
  };
  static newReward = async (phone: string, item_id: number) => {
    console.log("new Reward", phone, item_id);
    try {
      const playerExisted = await PlayerService.getOne({
        where: {
          phone,
          is_deleted: false,
        },
      });
      if (playerExisted) {
        const itemExisted = await ItemService.getOne({
          where: {
            id: item_id,
            is_deleted: false,
          },
        });

        if (itemExisted) {
          const rewardRepository = myDataSource.getRepository(Reward);
          const reward = new Reward();
          reward.campaign_id = itemExisted.campaign_id;
          reward.player_id = playerExisted.id;
          reward.item_id = itemExisted.id;

          //Save reward
          await rewardRepository.save(reward);
          //Decrease item quantity
          await ItemService.updateQuantity(item_id);

          return true;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
  };
}
