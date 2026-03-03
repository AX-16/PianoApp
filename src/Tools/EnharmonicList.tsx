export type PitchClass =
    | 'C' | 'C#' | 'D' | 'D#' | 'E'
    | 'F' | 'F#' | 'G' | 'G#'
    | 'A' | 'A#' | 'B';

export const ENHARMONIC_MAP: Record<string, PitchClass> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
    'Cb': 'B',

    'E#': 'F',
    'B#': 'C',

    'F##': 'G',
    'C##': 'D',
    'G##': 'A',
    'D##': 'E',
    'A##': 'B',
};

export function normalizePitchClass(note: string): PitchClass {
    return (ENHARMONIC_MAP[note] ?? note) as PitchClass;
}