import { NoteEdit, NoteDisplay } from './NodeNote';

interface MemoSectionProps {
  note: string;
  isEdit: boolean;
  onNoteChange?: (value: string) => void;
}

export function MemoSection({ note, isEdit, onNoteChange }: MemoSectionProps) {
  if (isEdit && onNoteChange) {
    return <NoteEdit value={note} onChange={onNoteChange} />;
  }

  return <NoteDisplay note={note} />;
}
