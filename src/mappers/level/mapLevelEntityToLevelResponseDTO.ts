import { Level } from "../../models/Level";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";

export function mapLevelEntityToLevelResponseDTO(level: Level) {
  return new LevelResponseDTO(
    level.level_id,
    level.level_name,
    level.level_statement,
    level.level_image,
    level.weighting_id,
    level.category_id,
  );
}
