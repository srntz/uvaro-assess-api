import { QuestionService } from '../../services/QuestionService';
import { Question } from '../../models/Question';

export const followupsResolver = {
  Query: {
    followups: async (_: any, { category_id }: { category_id: number }): Promise<Question[]> => {
      const questionService = new QuestionService();
      
      // fetch questions where follow_up is true and category_id matches
      const followupQuestions = await questionService.getFollowupQuestionsByCategory(category_id);
      
      return followupQuestions;
    }
  }
};

export default followupsResolver;