import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";

export function mapLevelWithWeightingDTOToLevelResponseDTO(
  level: LevelWithWeightingDTO,
): LevelResponseDTO {
  return new LevelResponseDTO(
    level.level_id,
    level.level_name,
    level.level_statement,
    level.weighting_id,
    level.category_id,
  );
}
