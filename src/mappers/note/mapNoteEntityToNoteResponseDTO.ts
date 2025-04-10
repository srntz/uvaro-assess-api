import { Note } from "../../models/Note";
import { NoteResponseDTO } from "../../dto/note/NoteResponseDTO";

export function mapNoteEntityToNoteResponseDTO(note: Note) {
  if (!note) {
    return null;
  }

  return new NoteResponseDTO(
    note.note_text,
    note.assessment_id,
    note.category_id,
  );
}
