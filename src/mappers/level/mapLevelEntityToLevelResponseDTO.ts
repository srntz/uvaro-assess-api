import { Level } from "../../models/Level";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";

export function mapLevelEntityToLevelResponseDTO(level: Level) {
  return new LevelResponseDTO(
    level.level_id,
    level.level_name,
    level.level_statement,
    level.weighting_id,
    level.category_id,
  );
}
