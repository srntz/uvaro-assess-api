import { AnswerInsertDTO } from "../AnswerInsertDTO";
import { AnswerInsertInput } from "../../interfaces/input/AnswerInsertInput";

export function mapAnswerInputToDTO(data: AnswerInsertInput) {
  return new AnswerInsertDTO(data.question_id, data.answer_id);
}
