import {CategoryService} from "../services/CategoryService";
import {DatabaseConnection} from "../db/DatabaseConnection";
import {answer, category, level, question} from "../db/schemas";

export const resolvers = {
  Query: {
    categories: async () => {
      const service = new CategoryService();
      return await service.getCategories();
    }
  },
  Category: {
    levels: async (parent) => {
      const db = DatabaseConnection.getInstance();
      return await db.select().from(level);
    },
    questions: async (parent) => {
      const db = DatabaseConnection.getInstance();
      return await db.select().from(question).where(question.category_id === parent.category_id);
    }
  },
  Question: {
    answers: async (parent) => {
      const db = DatabaseConnection.getInstance();
      return await db.select().from(answer);
    }
  }
}
