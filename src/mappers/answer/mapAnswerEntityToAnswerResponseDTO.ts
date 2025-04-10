import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { Answer } from "../../models/Answer";

export function mapAnswerEntityToAnswerResponseDTO(answer: Answer) {
  if (!answer) {
    return null;
  }

  return new AnswerResponseDTO(
    answer.answer_id,
    answer.answer_text,
    answer.weighting_id,
    answer.question_id,
  );
}
