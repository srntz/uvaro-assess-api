import { AnswerWithWeightingAndCoefficientDTO } from "../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { AssessmentService } from "../services/implementations/AssessmentService";
import { LevelWithWeightingDTO } from "../dto/level/LevelWithWeightingDTO";
import { AnswerRequestDTO } from "../dto/answer/AnswerRequestDTO";
import { AssessmentRepository } from "../repositories/implementations/AssessmentRepository";
import { LevelRepository } from "../repositories/implementations/LevelRepository";
import dotenv from "dotenv";
import { AnswerRepository } from "../repositories/implementations/AnswerRepository";

dotenv.config({ path: "../../.env.production" });

function testNormalization() {
  const answers: AnswerWithWeightingAndCoefficientDTO[] = [
    {
      answer_id: 1,
      weighting: 400,
      weighting_coefficient: 1,
      question_id: 1,
    },
    {
      answer_id: 1,
      weighting: 300,
      weighting_coefficient: 1.2,
      question_id: 1,
    },
    {
      answer_id: 1,
      weighting: 300,
      weighting_coefficient: 0.9,
      question_id: 1,
    },
    {
      answer_id: 1,
      weighting: 400,
      weighting_coefficient: 1.8,
      question_id: 1,
    },
  ];

  const levels: LevelWithWeightingDTO[] = [
    new LevelWithWeightingDTO("", "", 0, 1, 1, 1),
    new LevelWithWeightingDTO("", "", 100, 1, 1, 1),
    new LevelWithWeightingDTO("", "", 200, 1, 1, 1),
    new LevelWithWeightingDTO("", "", 300, 1, 1, 1),
    new LevelWithWeightingDTO("", "", 400, 1, 1, 1),
  ];

  let totalCoefficient = 0;
  let totalWeighting = 0;
  answers.forEach((answer: AnswerWithWeightingAndCoefficientDTO) => {
    totalCoefficient += answer.weighting_coefficient;
  });
  answers.forEach((answer: AnswerWithWeightingAndCoefficientDTO) => {
    totalWeighting +=
      answer.weighting * (answer.weighting_coefficient / totalCoefficient);
  });

  console.log(`expected total weighting: ${totalWeighting}`);

  const service = new AssessmentService(null, null, null);

  service.calculateLevel(answers, levels, totalCoefficient);
}

async function testGetLevel() {
  const answers: AnswerRequestDTO[] = [
    {
      answerId: 3,
      questionId: 1,
    },
    {
      answerId: 8,
      questionId: 1,
    },
    {
      answerId: 13,
      questionId: 1,
    },
    {
      answerId: 18,
      questionId: 1,
    },
  ];

  return await new AssessmentService(
    new AssessmentRepository(),
    new LevelRepository(),
    null,
    new AnswerRepository(),
  ).getLevel(answers, 1);
}

async function main() {
  // testNormalization();
  console.log(await testGetLevel());
}

await main();
