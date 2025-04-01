import { INotificationService } from "../interfaces/INotificationService";
import { IAssessmentRepository } from "../../repositories/interfaces/IAssessmentRepository";
import { NotificationBuilder } from "../../utils/notificationBuilder/NotificationBuilder";
import { RichTextSection } from "../../utils/notificationBuilder/classes/RichTextSection";
import { TextBlock } from "../../utils/notificationBuilder/classes/TextBlock";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { RichTextList } from "../../utils/notificationBuilder/classes/RichTextList";

export class NotificationService implements INotificationService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async send(assessmentId: number): Promise<void> {
    const builder = new NotificationBuilder();

    builder
      .header("New Completed Assessment!")
      .richText(
        new RichTextSection().add(
          new TextBlock({ text: "by " }),
          new TextBlock({ text: "John Doe", style: { bold: true } }),
        ),
      )
      .divider();

    const categories = await this.categoryRepository.getAll();
    const levels =
      await this.assessmentRepository.getAssessmentLevels(assessmentId);
    const notes = await this.assessmentRepository.getNotes(assessmentId);
    const answers =
      await this.assessmentRepository.getAssessmentAnswerQuestionPairs(
        assessmentId,
      );

    for (let i = 0; i < categories.length; i++) {
      const categoryLevel = levels.find(
        (level) => level.category_id === categories[i].category_id,
      );

      const categoryNote = notes.find(
        (note) => note.category_id === categories[i].category_id,
      );

      const categoryAnswers = answers.filter(
        (pair) => pair.question.category_id === categories[i].category_id,
      );

      if (categoryLevel) {
        builder
          .header(categories[i].category_name)
          .richText(
            new RichTextSection().add(
              new TextBlock({ text: "Level: ", style: { bold: true } }),
              new TextBlock({
                text: `${categoryLevel.weighting_id} - ${categoryLevel.level_statement}`,
              }),
            ),
          )
          .blankSpace();
      }

      if (categoryNote) {
        builder
          .richText(
            new RichTextSection().add(
              new TextBlock({ text: "Note", style: { bold: true } }),
            ),
            new RichTextSection().add(
              new TextBlock({ text: categoryNote.note_text }),
            ),
          )
          .blankSpace();
      }

      if (categoryAnswers) {
        builder
          .richText(
            new RichTextSection().add(
              new TextBlock({ text: "Answers", style: { bold: true } }),
            ),
            new RichTextList({ style: "bullet", border: 1 }).add(
              ...(() => {
                const sections: RichTextSection[] = [];

                categoryAnswers.forEach((pair) => {
                  sections.push(
                    new RichTextSection().add(
                      new TextBlock({
                        text: `${pair.question.question_text} - `,
                        style: { bold: true },
                      }),
                      new TextBlock({ text: pair.answer.answer_text }),
                    ),
                  );
                });

                return sections;
              })(),
            ),
          )
          .blankSpace();
      }
    }

    return Promise.resolve(undefined);
  }
}
