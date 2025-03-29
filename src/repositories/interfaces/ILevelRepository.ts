import { Level } from "../../models/Level";

export interface ILevelRepository {
  getLevelsByCategory(categoryId: number): Promise<Level[]>;
  getLevelById(levelId: number): Promise<Level>;
}
