import { Level } from "../../models/Level.js";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO.js";

export function mapLevelEntityToLevelResponseDTO(level: Level) {
  return new LevelResponseDTO(
    level.level_id,
    level.level_name,
    level.level_statement,
    level.weighting_id,
    level.category_id,
  );
}
