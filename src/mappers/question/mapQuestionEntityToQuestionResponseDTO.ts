import { Question } from "../../models/Question";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";

export function mapQuestionEntityToQuestionResponseDTO(question: Question) {
  if (!question) {
    return null;
  }

  return new QuestionResponseDTO(
    question.question_id,
    question.category_id,
    question.question_text,
    question.follow_up,
  );
}
