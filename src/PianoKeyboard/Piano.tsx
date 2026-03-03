import styles from './Piano.module.css';
import { NOTES_OCTAVE } from './Notes';
import { useRef } from 'react';
import * as Tone from 'tone'

type KeyState = 'correct' | 'incorrect' | 'hover' | 'cheat' | 'none' | 'pressed'
type NoteNameState = 'on' | 'off'

type Props = {
    octaves: number,
    startOctave: number,
    activeNotes: string[],
    keyStates: Record<string, KeyState>,
    noteNameState: NoteNameState
    onNoteOn: (noteID: string) => void,
    onNoteOff: (noteID: string) => void,
    onHoverNoteOn: (noteID: string) => void,
    onHoverNoteOff: (noteID: string) => void
};

function Piano({ octaves = 1, startOctave = 3, activeNotes, keyStates, noteNameState, onNoteOn, onNoteOff, onHoverNoteOn, onHoverNoteOff }: Props) {
    const notes: {
        id: string;
        note: string;
        octave: number;
        keyType: 'white' | 'black';
    }[] = [];

    const whiteKeyWidth = 80;
    const blackKeyWidth = 60;

    const synthRef = useRef<Tone.PolySynth | null>(null);

    // synth ref needs to be replaced with real samples
    async function getSynth() {
        if (Tone.context.state != 'running') {
            await Tone.start();
            console.log("Audio Ready!!!");
        }

        if (!synthRef.current) {
            synthRef.current = new Tone.PolySynth(Tone.FMSynth).toDestination();
        }
    }


    for (let o = 0; o < octaves; o++) {
        for (const n of NOTES_OCTAVE) {
            notes.push({
                id: `${n.note}${startOctave + o}`,
                note: n.note,
                octave: startOctave + o,
                keyType: n.keyType,
            });
        }
    }

    async function handleNoteOn(noteID: string) {
        await getSynth();
        //console.log(`Note On: ${noteID}`);
        synthRef.current?.triggerAttack(noteID);
        onNoteOn(noteID);
    }

    async function handleNoteOff(noteID: string) {
        await getSynth();
        //console.log(`Note Off: ${noteID}`);
        synthRef.current?.triggerRelease(noteID);
        onNoteOff(noteID);
    }

    function handleNoteHoverOn(noteID: string) {
        console.log(`Hovering over: ${noteID}`);
        onHoverNoteOn(noteID);
    }

    function handleNoteHoverOff(noteID: string) {
        console.log(`Not hovering over ${noteID}`);
        onHoverNoteOff(noteID);
    }

    function blackKeyPosition(index: number): number {
        let whiteKeyCount = 0;

        for (let i = 0; i < index; i++) {
            if (notes[i].keyType === 'white') {
                whiteKeyCount++;
            }
        }

        return (whiteKeyCount * whiteKeyWidth) - (blackKeyWidth / 2);
    }

    const whiteNotes = notes.filter(n => n.keyType === 'white');
    const blackNotes = notes.filter(n => n.keyType === 'black');

    return (
        <>
            <div className={styles.piano}>
                <div className={styles.keyboard}>
                    {whiteNotes.map((n) => {
                        const keyState = keyStates[n.id] ?? 'none';
                        return (
                            <div
                                key={n.id}
                                className={`
                                    ${styles.key} 
                                    ${styles.white}
                                    ${activeNotes.includes(n.id) ? styles.active : ''}
                                    ${keyState === 'correct'
                                        ? styles.correctKey
                                        : keyState === 'hover'
                                            ? styles.highlights
                                            : keyState === 'incorrect'
                                                ? styles.incorrectKey
                                                : keyState === 'pressed'
                                                    ? styles.pressedKey
                                                    : ''
                                    }
                                `}
                                onMouseDown={() => handleNoteOn(n.id)}
                                onMouseUp={() => handleNoteOff(n.id)}
                                onMouseLeave={() => {
                                    handleNoteOff(n.id)
                                    handleNoteHoverOff(n.id)
                                }}
                                onMouseEnter={() => {
                                    handleNoteHoverOn(n.id);
                                }}
                            >
                                {noteNameState === 'on' ? `${n.note}${n.octave}` : ''}
                            </div>
                        )
                    })}
                    {blackNotes.map((n) => {
                        const originalIndex = notes.findIndex(note => note.id === n.id);
                        const keyState = keyStates[n.id] ?? 'none';
                        return (
                            <div
                                key={n.id}
                                className={`
                                    ${styles.key} 
                                    ${styles.black}
                                    ${activeNotes.includes(n.id) ? styles.active : ''}
                                    ${keyState === 'correct'
                                        ? styles.correctKey
                                        : keyState === 'hover'
                                            ? styles.highlights
                                            : keyState === 'incorrect'
                                                ? styles.incorrectKey
                                                : keyState === 'pressed'
                                                    ? styles.pressedKey
                                                    : ''
                                    }
                                `}
                                style={{ left: `${blackKeyPosition(originalIndex)}px` }}
                                onMouseDown={() => handleNoteOn(n.id)}
                                onMouseUp={() => handleNoteOff(n.id)}
                                onMouseLeave={() => {
                                    handleNoteOff(n.id);
                                    handleNoteHoverOff(n.id);
                                }}
                                onMouseEnter={() => {
                                    handleNoteHoverOn(n.id);
                                }}
                            >
                                {noteNameState === 'on' ? `${n.note}${n.octave}` : ''}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Piano;
