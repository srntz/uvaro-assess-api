import { Level } from "../../models/Level";

export interface ILevelService {
  getLevelsByCategory(categoryId: number): Promise<Level[]>;
}
