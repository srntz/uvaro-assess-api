import { UserService } from "../../services/UserService";
import { User } from "../../models/User";
import { IUser } from "../../db/schemas";
import { NoteService } from "../../services/NoteService";
import { Service } from "../../services/Service";
import { Note } from "../../models/Note";

async function addUserResolver(userData: IUser) {
  const service = new UserService();

  const user = new User(userData);

  return await service.create(user);
}

// TODO: implement the method and enable eslint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addAssessmentResolver(userId) {}

async function saveNoteResolver(note: Note) {
  const service: Service<Note> = new NoteService();
  return await service.create(note);
}

export const mutationResolvers = {
  Mutation: {
    addUser: (_, args) => addUserResolver(args.user),
    addAssessment: (_, args) => addAssessmentResolver(args.user_id),
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
