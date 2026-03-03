export const NOTES_OCTAVE = [ 
    { note: 'C', keyType: 'white' },
    { note: 'C#', keyType: 'black' },
    { note: 'D', keyType: 'white' },
    { note: 'D#', keyType: 'black' },
    { note: 'E', keyType: 'white' },
    { note: 'F', keyType: 'white' },
    { note: 'F#', keyType: 'black' },
    { note: 'G', keyType: 'white' },
    { note: 'G#', keyType: 'black' },
    { note: 'A', keyType: 'white' },
    { note: 'A#', keyType: 'black' },
    { note: 'B', keyType: 'white' },
] as const;

export const ENHARMONIC_MAP = [
    { note: 'C#', enharmonic: 'Db' },
    { note: 'D#', enharmonic: 'Eb' },
    { note: 'F#', enharmonic: 'Gb' },
    { note: 'G#', enharmonic: 'Ab' },
    { note: 'A#', enharmonic: 'Bb' },
    { note: 'E' , enharmonic: 'Fb' },
    { note: 'B' , enharmonic: 'Cb' },
    { note: 'E#', enharmonic: 'F'  },
    { note: 'B#', enharmonic: 'C'  },
] as const;