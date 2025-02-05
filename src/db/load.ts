import { DatabaseConnection } from "./DatabaseConnection";
import {
  answer,
  category,
  IAnswer,
  ICategory,
  ILevel,
  IQuestion,
  level,
  question,
} from "./schemas";
import dotenv from "dotenv";

dotenv.config();

const db = DatabaseConnection.getInstance();

interface IDataQuestion extends IQuestion {
  answers: IAnswer[];
}

interface IData extends ICategory {
  questions: IDataQuestion[];
  levels: ILevel[];
}

const data: IData[] = [
  {
    category_name: "Financial Health",
    category_description: "Financial Health Description",
    category_image: "https://example.com/images/finhealth.jpg",
    questions: [
      {
        question_text: "How do you currently manage your financial resources?",
        follow_up: false,
        answers: [
          {
            answer_text:
              "I often struggle to cover my expenses and live paycheck-to-paycheck.",
            weighting: 0,
            question_id: null,
          },
          {
            answer_text:
              "I can consistently cover my expenses and have some money for savings.",
            weighting: 10,
            question_id: null,
          },
          {
            answer_text:
              "I actively save money and work toward achieving financial goals.",
            weighting: 20,
            question_id: null,
          },
          {
            answer_text:
              "I have a clear plan for long-term financial stability and investments.",
            weighting: 30,
            question_id: null,
          },
          {
            answer_text:
              "I am confident in my financial strategies and actively mentor others in financial management.",
            weighting: 40,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "What best describes your financial priorities right now?",
        follow_up: false,
        answers: [
          {
            answer_text: "Covering basic needs and avoiding debt.",
            weighting: 0,
            question_id: null,
          },
          {
            answer_text:
              "Building an emergency fund and reducing unnecessary expenses.",
            weighting: 10,
            question_id: null,
          },
          {
            answer_text:
              "Saving for specific goals like buying a home or traveling.",
            weighting: 20,
            question_id: null,
          },
          {
            answer_text:
              "Investing in long-term assets like retirement funds or real estate.",
            weighting: 30,
            question_id: null,
          },
          {
            answer_text:
              "Achieving financial independence and helping others do the same.",
            weighting: 40,
            question_id: null,
          },
        ],
        category_id: null,
      },
      {
        question_text:
          "How do you feel about your ability to plan for future financial needs?",
        follow_up: false,
        answers: [
          {
            answer_text:
              "I feel overwhelmed and unsure about planning for the future.",
            weighting: 0,
            question_id: null,
          },
          {
            answer_text:
              "I am beginning to think about future expenses and exploring financial planning tools.",
            weighting: 10,
            question_id: null,
          },
          {
            answer_text:
              "I have a budget and some short- and medium-term financial goals.",
            weighting: 20,
            question_id: null,
          },
          {
            answer_text:
              "I regularly evaluate my financial plans to ensure I meet long-term goals.",
            weighting: 30,
            question_id: null,
          },
          {
            answer_text:
              "I feel secure about the future and advise others on how to plan financially.",
            weighting: 40,
            question_id: null,
          },
        ],
        category_id: null,
      },
    ],
    levels: [
      {
        level_name: "Hm...",
        level_statement: "Yeah, that's sad :(",
        required_weighting: 0,
        category_id: null,
      },
      {
        level_name: "Ok!",
        level_statement: "You're not bad.",
        required_weighting: 30,
        category_id: null,
      },
      {
        level_name: "Not bad!",
        level_statement:
          "Good job for trying to improve your financial skills, take a look at how they could be further improved.",
        required_weighting: 60,
        category_id: null,
      },
      {
        level_name: "Good Job!",
        level_statement:
          "You are doing a good job managing your personal finances. Although, some of your habits could be improved.",
        required_weighting: 90,
        category_id: null,
      },
      {
        level_name: "You are great!",
        level_statement:
          "You are doing a great job managing your personal finances. Keep it up!",
        required_weighting: 120,
        category_id: null,
      },
    ],
  },
];

async function truncateAll() {
  await db.execute('TRUNCATE "user", category RESTART IDENTITY CASCADE');
}

async function categoryInsert(data: ICategory) {
  const res = await db
    .insert(category)
    .values(data)
    .returning({ category_id: category.category_id });

  return res[0].category_id;
}

async function questionInsert(data: typeof question.$inferInsert) {
  const res = await db
    .insert(question)
    .values(data)
    .returning({ question_id: question.question_id });

  return res[0].question_id;
}

async function answerInsert(data: typeof answer.$inferInsert) {
  await db.insert(answer).values(data);
}

async function levelInsert(data: typeof level.$inferInsert) {
  await db.insert(level).values(data);
}

async function main() {
  await truncateAll();

  for (const category of data) {
    const category_id = await categoryInsert(category);

    for (const question of category.questions) {
      const question_id = await questionInsert({ ...question, category_id });

      for (const answer of question.answers) {
        await answerInsert({ ...answer, question_id });
      }
    }

    for (const level of category.levels) {
      await levelInsert({ ...level, category_id });
    }
  }

  process.exit();
}

main();
