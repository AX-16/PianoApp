import { normalizePitchClass } from './EnharmonicList';

export function stripOctave(note: string): string {
  return note.replace(/\d+$/, '');
}

export function normalizeInputNote(noteID: string) {
  return normalizePitchClass(stripOctave(noteID));
}