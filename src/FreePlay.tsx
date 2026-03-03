import { Link } from "react-router-dom";
import Piano from "./PianoKeyboard/Piano";
import styles from './FreePlay.module.css';
import { useState, useRef } from "react";

type NoteEvent = {
    noteID: string;
    startTime: number;
    endTime?: number;
    duration?: number;
}

type KeyState = 'correct' | 'incorrect' | 'hover' | 'cheat' | 'none'
type NoteNameState = 'on' | 'off'

const MAX_OCT_COUNT = 3;

function getStartPosition(octCount: number): number {
    if (octCount >= 1 && octCount <= 2) {
        return 3;
    } else if (octCount >= 3 && octCount <= 4) {
        return 2;
    }
    return 1;
}

function FreePlay() {
    const [octaveCount, setOctaveCount] = useState(1);
    const [octaveStart, setOctaveStart] = useState(3);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);
    const [noteHistory, setNoteHistory] = useState<NoteEvent[]>([]);
    const [keyStates, setKeyStates] = useState<Record<string, KeyState>>({});
    const activeTimersRef = useRef<Map<string, number>>(new Map());
    const [noteName, setNoteName] = useState<NoteNameState>('on');

    function handleNoteOn(noteID: string) {
        if (activeNotes.includes(noteID)) return;

        setActiveNotes(prev =>
            prev.includes(noteID) ? prev : [...prev, noteID]
        );

        activeTimersRef.current.set(noteID, Date.now());
    }

    function handleNoteOff(noteID: string) {
        setActiveNotes(prev =>
            prev.filter(n => n !== noteID)
        );

        const startTime = activeTimersRef.current.get(noteID);
        if (startTime) {
            const endTime = Date.now();
            const duration = endTime - startTime;

            const noteEvent: NoteEvent = {
                noteID,
                startTime,
                endTime,
                duration
            }

            setNoteHistory(
                prev => [noteEvent, ...prev].slice(0, 10)
            );
            activeTimersRef.current.delete(noteID);
        }
    }

    function handleAddOctave() {
        if (octaveCount + 1 > MAX_OCT_COUNT) return;
        setOctaveCount(o => {
            const newVal = o + 1;
            setOctaveStart(getStartPosition(newVal));
            return newVal;
        });
    }

    function handleSubOctave() {
        if (octaveCount - 1 <= 0) return;
        setOctaveCount(o => {
            const newVal = o - 1;
            setOctaveStart(getStartPosition(newVal));
            return newVal;
        });
    }

    function handleNameShow(state: NoteNameState) {
        if (state === 'on') {
            setNoteName('on');
        } else if (state === 'off') {
            setNoteName('off');
        }
    }

    function handleNoteHoverOn(noteID: string) {
        console.log(`${noteID} on`);
    }

    function handleNoteHoverOff(noteID: string) {
        console.log(`${noteID} off`);
    }

    return (<>
        <div className={styles.container}>
            <p className={styles.freeplayText}>FREE PLAY</p>
            <div className={styles.pianoContainer}>
                <Piano
                    octaves={octaveCount}
                    startOctave={octaveStart}
                    activeNotes={activeNotes}
                    keyStates={keyStates}
                    noteNameState={noteName}
                    onNoteOn={handleNoteOn}
                    onNoteOff={handleNoteOff}
                    onHoverNoteOn={handleNoteHoverOn}
                    onHoverNoteOff={handleNoteHoverOff}
                />
                <div className={styles.controlBox}>
                    <div className={styles.controls}>
                        <span className={styles.noteList}>
                            {activeNotes.length === 0 ?
                                (
                                    <span>/</span>
                                ) : (
                                    activeNotes.map(note =>
                                        <span key={note}>{note}</span>
                                    )
                                )
                            }
                        </span>
                    </div>
                    <div className={styles.controls}>
                        <button className={styles.octButton} onClick={handleAddOctave} disabled={octaveCount >= MAX_OCT_COUNT}>+</button>
                        <button className={styles.octButton} onClick={handleSubOctave} disabled={octaveCount <= 1}>-</button>
                        <label className={styles.octCount}>{octaveCount < 2 ? `${octaveCount} octave` : `${octaveCount} octaves`}</label>
                    </div>
                    <div className={styles.controls}>
                        <label>Note names</label>
                        <select
                            className={styles.selectBox}
                            value={noteName}
                            onChange={e => handleNameShow(e.target.value as NoteNameState)}
                        >
                            <option value='on'>ON</option>
                            <option value='off'>OFF</option>
                        </select>
                    </div>

                </div>
            </div>
            <div className={styles.notesPressedList}>
                <div className={styles.historyList}>
                    <div className={styles.logTitle}>HISTORY</div>

                    <ul id="notesList" className={styles.noteListHistory}>
                        {noteHistory.length === 0 ?
                            (
                                <li>No history</li>
                            ) : (
                                noteHistory.map((event, _) =>
                                    <li key={`${event.noteID}-${event.startTime}`}>
                                        <span>{event.noteID}</span>
                                        <span>{event.duration}ms</span>
                                    </li>
                                )
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
        <div className={styles.backContainer}>
            <Link to="/" className={styles.link}>Home</Link>
        </div>
    </>);
}

export default FreePlay;