import { Link, useLocation } from 'react-router-dom'
import Piano from '../PianoKeyboard/Piano'
import styles from './ScalesGame.module.css'
import { useState } from 'react'
import { SCALES } from '../Tools/ScalesList'
import { normalizeInputNote } from '../Tools/Notes';
import type { PitchClass } from '../Tools/EnharmonicList'
import './ScalesMain.css'

type Scale = typeof SCALES[number];
type KeyState = 'correct' | 'incorrect' | 'hover' | 'cheat' | 'none'
type NoteNameState = 'on' | 'off'

function ScalesLearning() {
    const { state } = useLocation();
    const {
        scaleList,
    } = state || {};

    if (!scaleList) {
        return (
            <>
                <p>No scales selected. Redirecting...</p>
                <Link to="/scales">Back</Link>
            </>
        );
    }

    const scalesAvailable = SCALES.filter(scale =>
        scaleList.some(
            (s: string) => s === `${scale.scale}${scale.scaleType}`
        )
    );

    if (scalesAvailable.length === 0) {
        return (
            <>
                <p>No matching scales found.</p>
                <Link to="/scales">Back</Link>
            </>
        );
    }

    const [currentScaleSelected, setCurrentScaleSelected] = useState<Scale>(() => scalesAvailable[Math.floor(Math.random() * scalesAvailable.length)]);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);
    const [pressedKeyList, setPressedKeyList] = useState<PitchClass[]>([]);
    const [scaleFinished, setScaleFinished] = useState(false);
    //const [highlightSelect, setHighlightSelect] = useState<string>();
    const [noteName, setNoteName] = useState<NoteNameState>('on');
    const [keyStates, setKeyStates] = useState<Record<string, KeyState>>({});
    const [expandSelectedScales, setExpandSelectedScales] = useState(false);

    const scaleNotes = currentScaleSelected.notes.map(n =>
        normalizeInputNote(n)
    );

    const correctCount = scaleNotes.filter(note =>
        pressedKeyList.includes(note)
    ).length;

    const totalCount = scaleNotes.length;

    function handleNoteOn(noteID: string) {
        const normalized = normalizeInputNote(noteID);

        if (scaleNotes.includes(normalized)) {
            setKeyStates((prev) => ({
                ...prev,
                [noteID]: 'correct'
            }))

        } else {
            setKeyStates((prev) => ({
                ...prev,
                [noteID]: 'incorrect'
            }))
        }

        setPressedKeyList(prev =>
            prev.includes(normalized) ? prev : [...prev, normalized]
        );
    }

    function handleNoteOff() {
        const expectedNotes: PitchClass[] = currentScaleSelected.notes.map(note => normalizeInputNote(note));

        // don’t validate too early
        if (pressedKeyList.length < expectedNotes.length) return;

        const isCorrect = expectedNotes.every(note =>
            pressedKeyList.includes(note)
        );

        if (isCorrect) {
            setScaleFinished(true);
            console.log('Correct scale!');

            // reset for next attempt
            setPressedKeyList([]);

            // optional: pick a new random scale
            setTimeout(() => {
                setCurrentScaleSelected(
                    scalesAvailable[
                    Math.floor(Math.random() * scalesAvailable.length)
                    ]
                );
                setScaleFinished(false);
                setKeyStates({});
                return;
            }, 2000)
        }
    }

    function overrideScale(id: number) {
        setCurrentScaleSelected(scalesAvailable[id]);
        setKeyStates({});
        setPressedKeyList([]);
    }

    function handleNoteHoverOn(noteID: string) {
        const normalized = normalizeInputNote(noteID);

        if (scaleNotes.includes(normalized)) {
            setKeyStates(prev => {
                const currentState = prev[noteID];

                // don't overwrite anything
                if (currentState === 'correct' || currentState === 'incorrect') {
                    return prev;
                }

                return {
                    ...prev,
                    [noteID]: 'hover'
                }
            })
        }
    }

    function handleNoteHoverOff(noteID: string) {
        setKeyStates(prev => {
            const currentState = prev[noteID];

            // don't overwrite anything
            if (currentState === 'correct' || currentState === 'incorrect') {
                return prev;
            }

            return {
                ...prev,
                [noteID]: 'none'
            }
        })
    }

    function handleNameShow(state: NoteNameState) {
        if (state === 'on') {
            setNoteName('on');
        } else if (state === 'off') {
            setNoteName('off');
        }
    }

    function scaleFormatting(scale: string): string {
        const root = scale.slice(0, -5);
        if (scale.endsWith('major')) {
            return `${root} Major`;
        }
        return `${root} Minor`;
    }

    return (<div className={styles.pageContainer}>
        <div className={styles.titleContainer}>
            <p className={styles.title}>SCALES LEARNING</p>
        </div>
        <div className={styles.currentContainer}>
            <span className={styles.underline}>
                Current scale:{' '}
            </span>
            <span className={styles.scaleName}>
                {currentScaleSelected.scale} {currentScaleSelected.scaleType}
            </span>
        </div>

        <div className={styles.finishedContainer}>
            {scaleFinished
                ? 'Scale Complete!'
                : `${correctCount}/${totalCount}`}
        </div>

        <div className={styles.pianoContainer}>
            <Piano
                octaves={1}
                startOctave={3}
                activeNotes={activeNotes}
                keyStates={keyStates}
                noteNameState={noteName}
                onNoteOn={handleNoteOn}
                onNoteOff={handleNoteOff}
                onHoverNoteOn={handleNoteHoverOn}
                onHoverNoteOff={handleNoteHoverOff}
            />
        </div>

        <div className={styles.optionsContainer}>
            <div className={styles.option}>
                <label>Manual Scale Selection</label>
                <select value={scalesAvailable.indexOf(currentScaleSelected)}
                    onChange={(e) => overrideScale(Number(e.target.value))}>

                    {scalesAvailable.map((scale, index) => {
                        return <option key={`${scale.scale}${scale.scaleType}`} value={index}>{scale.scale} {scale.scaleType}</option>
                    })}
                </select>
            </div>
            <div className={styles.option}>
                <label>Note names</label>
                <select
                    value={noteName}
                    onChange={e => handleNameShow(e.target.value as NoteNameState)}
                >
                    <option value='on'>ON</option>
                    <option value='off'>OFF</option>
                </select></div>
        </div>

        <button onClick={() => setExpandSelectedScales(!expandSelectedScales)} className={styles.expandLink}>{expandSelectedScales ? 'Shrink scale list' : 'Expand scale list'}</button>

        {expandSelectedScales && (
            <div className={styles.scaleListContainer}>
                <p className={styles.scaleDescription}>Selected scales:</p>

                {(() => {
                    const count = scaleList.length;
                    const colCount = count <= 8 ? 1 : count <= 16 ? 2 : 3;
                    const colSize = Math.ceil(count / colCount);

                    const columns: string[][] = Array.from({ length: colCount }, (_, i) =>
                        scaleList.slice(i * colSize, (i + 1) * colSize)
                    );

                    return (
                        <div className={styles.columnsWrapper}>
                            {columns.map((col, colIndex) => (
                                <>
                                    {colIndex > 0 && (
                                        <div key={`divider-${colIndex}`} className={styles.columnDivider} />
                                    )}
                                    <ol key={colIndex} className={styles.column} start={colIndex * colSize + 1}>
                                        {col.map((scale: string) => {
                                            return (
                                                <li className={styles.listItem} key={scale}>
                                                    <span className={styles.listIndex}></span>
                                                    <span className={styles.listName}>{scaleFormatting(scale)}</span>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </>
                            ))}
                        </div>
                    );
                })()}
            </div>
        )}


        <Link to="/scales" className={styles.link}>BACK</Link>
    </div>);
}

export default ScalesLearning