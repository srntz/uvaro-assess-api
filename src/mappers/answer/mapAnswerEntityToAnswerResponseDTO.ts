import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO.js";
import { Answer } from "../../models/Answer.js";

export function mapAnswerEntityToAnswerResponseDTO(answer: Answer) {
  return new AnswerResponseDTO(
    answer.answer_id,
    answer.answer_text,
    answer.weighting_id,
    answer.question_id,
  );
}
