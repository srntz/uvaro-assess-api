import { UserService } from "../../services/UserService";
import { User } from "../../models/User";
import { IUser } from "../../db/schemas";
import { NoteService } from "../../services/NoteService";
import { Service } from "../../services/Service";
import { Note } from "../../models/Note";
import { Assessment } from "../../models/Assessment";
import { AssessmentService } from "../../services/AssessmentService";

async function addUserResolver(userData: IUser) {
  const service = new UserService();

  const user = new User(userData);

  return await service.create(user);
}

async function addAssessmentResolver(userId: string) {
  const insertAssessment = new Assessment({ user_id: userId });
  const service = new AssessmentService();

  return await service.create(insertAssessment);
}

async function finishAssessmentResolver(assessmentId: number) {
  const service = new AssessmentService();

  return await service.insertEndDateTime(assessmentId);
}

async function saveNoteResolver(note: Note) {
  const service: Service<Note> = new NoteService();
  return await service.create(note);
}

const mutationResolvers = {
  Mutation: {
    addUser: (_, args) => addUserResolver(args.user),
    addAssessment: (_, args) => addAssessmentResolver(args.user_id),
    endAssessment: (_, args) => finishAssessmentResolver(args.assessment_id),
    saveNote: (_, args) =>
      saveNoteResolver(
        new Note({
          assessment_id: args.assessment_id,
          category_id: args.category_id,
          note_text: args.note_text,
        }),
      ),
  },
};

export default mutationResolvers;
