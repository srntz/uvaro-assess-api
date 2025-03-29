import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { Answer } from "../../models/Answer";

export function mapAnswerEntityToAnswerResponseDTO(answer: Answer) {
  return new AnswerResponseDTO(
    answer.answer_id,
    answer.answer_text,
    answer.weighting_id,
    answer.question_id,
  );
}
