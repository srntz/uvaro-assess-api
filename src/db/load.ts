import { DatabaseConnection } from "./DatabaseConnection";
import { answer, category, level, question } from "./schemas";
import dotenv from "dotenv";

dotenv.config();

const db = DatabaseConnection.getInstance();

async function truncateAll() {
  await db.execute('TRUNCATE "user", category RESTART IDENTITY CASCADE');
}

async function categoryInsert(
  name: string,
  description: string,
  image: string,
) {
  const res = await db
    .insert(category)
    .values({
      category_name: name,
      category_description: description,
      category_image: image,
    } as typeof category.$inferInsert)
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

export async function mainLoad() {
  await truncateAll();

  await categoryInsert(
    "Financial Health",
    "Financial health description",
    "https://example.com/images/finhealth.jpg",
  ).then(async (category_id) => {
    await questionInsert({
      category_id,
      question_text: "How much do you spend per month?",
      follow_up: false,
    }).then(async (question_id) => {
      await answerInsert({ question_id, answer_text: "$500", weighting: 15 });
    });

    await levelInsert({
      category_id,
      level_name: "Good Job!",
      level_statement:
        "You are doing a great job managing your personal finances. Keep it up!",
      required_weighting: 400,
    });
  });

  process.exit();
}

mainLoad();
