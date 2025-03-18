import { answer as answerTable } from "../../db/schemas";
import { AnswerInsertDTO } from "../AnswerInsertDTO";

export function mapAnswerSelectToAnswerInsertDTO(
  answer: typeof answerTable.$inferSelect,
) {
  return new AnswerInsertDTO(answer.question_id, answer.answer_id);
}
