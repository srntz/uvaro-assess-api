import { Question } from "../../models/Question.js";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO.js";

export function mapQuestionEntityToQuestionResponseDTO(question: Question) {
  return new QuestionResponseDTO(
    question.question_id,
    question.category_id,
    question.question_text,
    question.follow_up,
  );
}
