// import { FindOneOptions } from "typeorm";
// import { myDataSource } from "../app-data-source";
// import { Item } from "../entity/item.entity";

// export class ItemService {
//   static getOne = async (query: FindOneOptions<Item>) => {
//     const itemRepository = myDataSource.getRepository(Item);
//     return itemRepository.findOne(query);
//   };
//   static updateQuantity = async (item_id: number) => {
//     const itemRepository = myDataSource.getRepository(Item);
//     const item = await this.getOne({
//       where: { id: item_id, is_deleted: false },
//     });

//     if (item && item.quantity_remain > 0) {
//       item.quantity_remain -= 1;
//       await itemRepository.save(item);
//     }
//   };
// }
