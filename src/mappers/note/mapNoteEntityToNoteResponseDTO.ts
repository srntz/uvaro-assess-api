import { Note } from "../../models/Note.js";
import { NoteResponseDTO } from "../../dto/note/NoteResponseDTO.js";

export function mapNoteEntityToNoteResponseDTO(note: Note) {
  return new NoteResponseDTO(
    note.note_text,
    note.assessment_id,
    note.category_id,
  );
}
