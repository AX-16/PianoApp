import { Link, useLocation } from 'react-router-dom'
import Piano from '../PianoKeyboard/Piano'
import styles from './ScalesGame.module.css'
import { useState, useEffect, useRef } from 'react'
import { SCALES } from '../Tools/ScalesList'
import { normalizeInputNote } from '../Tools/Notes';
import type { PitchClass } from '../Tools/EnharmonicList'
import './ScalesMain.css'

type Scale = typeof SCALES[number];
type KeyState = 'correct' | 'incorrect' | 'hover' | 'cheat' | 'none' | 'pressed'
type NoteNameState = 'on' | 'off'
type GamePhase = 'Prep' | 'Playing' | 'Results'
type TimeComparison = 'faster' | 'slower' | 'same' | null

type RoundResult = {
    scale: Scale;
    expected: PitchClass[];
    pressed: PitchClass[];
    correctCount: number;
}

function ScalesPractice() {
    const { state } = useLocation();
    const {
        scaleList,
        difficulty,
        rounds
    } = state || {};

    console.log(`difficulty: ${difficulty}`);

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
    const [roundNumber, setRoundNumber] = useState(1);
    const [roundTimer, setRoundTimer] = useState(0);
    const [timerList, setTimerList] = useState<number[]>([]);
    const [timerRunning, setTimerRunning] = useState(false);
    const [noteCounter, setNoteCounter] = useState(0);
    const [results, setResults] = useState<RoundResult[]>([]);
    const [currentGamePhase, setCurrentGamePhase] = useState<GamePhase>('Prep');
    const [countdownTimer, setCountdownTimer] = useState(3);
    const [countdownStarted, setCountdownStarted] = useState(false);
    const [disabledKeyboard, setDisabledKeyboard] = useState(true);
    const [expandResults, setExpandResults] = useState(false);
    const [timeComparison, setTimeComparison] = useState<TimeComparison>(null);
    const [roundComplete, setRoundComplete] = useState(false);
    const [lastRoundScore, setLastRoundScore] = useState<number>(0);
    const [roundOrder, setRoundOrder] = useState<Scale[]>([]);

    const startTimerRef = useRef(0);
    const intervalRef = useRef<number | null>(null);

    const totalScore = results.reduce(
        (sum, round) => sum + round.correctCount,
        0
    );

    const maxScore = rounds * 7;
    const percentage = maxScore > 0 ? ((totalScore * 100) / maxScore).toFixed(2) : "0.00";

    function generateRoundOrder(): Scale[] {
        const pool: Scale[] = [];

        for (let i = 0; i < rounds; i++) {
            pool.push(scalesAvailable[i % scalesAvailable.length]);
        }

        return shuffleArray(pool);
    }

    function shuffleArray<T>(array: T[]): T[] {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    useEffect(() => {
        if (!timerRunning) return;

        intervalRef.current = setInterval(() => {
            setRoundTimer(Date.now() - startTimerRef.current);
        }, 10);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [timerRunning])

    const scaleNotes = currentScaleSelected.notes.map(n =>
        normalizeInputNote(n)
    );

    function handleNoteOn(noteID: string) {
        if (disabledKeyboard) return;

        const normalized = normalizeInputNote(noteID);

        if (difficulty == 'easy') {
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
        } else {
            setKeyStates((prev) => ({
                ...prev,
                [noteID]: 'pressed'
            }))
        }

        setPressedKeyList(prev => {
            if (prev.includes(normalized)) {
                return prev;
            } else {
                setNoteCounter(n => n + 1);
                return [...prev, normalized];
            }
        });
    }

    function evaluateRound() {
        const expectedNotes: PitchClass[] = currentScaleSelected.notes.map(note => normalizeInputNote(note));
        setRoundComplete(true);
        const currentTime = roundTimer;
        const previousTime = timerList[timerList.length - 1];

        if (previousTime !== undefined) {
            if (currentTime < previousTime) {
                setTimeComparison('faster');
            } else if (currentTime > previousTime) {
                setTimeComparison('slower');
            } else {
                setTimeComparison('same');
            }
        } else {
            setTimeComparison('faster');
        }

        setExpandResults(false);
        const correctCount = expectedNotes.filter(note =>
            pressedKeyList.includes(note)
        ).length;

        setLastRoundScore(correctCount);

        setTimeout(() => {
            if (roundOrder[roundNumber]) {
                setCurrentScaleSelected(roundOrder[roundNumber]);
            }

            // increase score counter on every correct note from scale, 7 max, 0 minimum

            setResults(r => [
                ...r,
                {
                    scale: currentScaleSelected,
                    expected: expectedNotes,
                    pressed: pressedKeyList,
                    correctCount
                }
            ]);

            setTimerList(t => [...t, roundTimer]);
            setRoundTimer(0);
            startTimerRef.current = Date.now();

            setScaleFinished(false);
            setKeyStates({});
            setPressedKeyList([]);
            setTimerRunning(true);
            setRoundNumber(s => {
                const next = s + 1;
                if (next > rounds) {
                    setCurrentGamePhase('Results');
                    setTimerRunning(false);
                }
                return next;
            });
            setDisabledKeyboard(false);
            setTimeComparison(null);
            setRoundComplete(false);
            return;
        }, 2000)
    }

    function handleNoteOff() {
        if (disabledKeyboard) return;

        const expectedNotes: PitchClass[] = currentScaleSelected.notes.map(note => normalizeInputNote(note));

        if (pressedKeyList.length < expectedNotes.length) return;

        const isCorrect = expectedNotes.every(note =>
            pressedKeyList.includes(note)
        );

        if (isCorrect || noteCounter >= 6) {
            setScaleFinished(true);
            setDisabledKeyboard(true);
            setTimerRunning(false);
            evaluateRound();
        }
    }

    function handleNoteHoverOn(noteID: string) {
        if (disabledKeyboard) return;

        const normalized = normalizeInputNote(noteID);
        console.log(normalized);
    }

    function handleNoteHoverOff(noteID: string) {
        if (disabledKeyboard) return;

        console.log(noteID);
    }

    function handleNameShow(state: NoteNameState) {
        if (state === 'on') {
            setNoteName('on');
        } else if (state === 'off') {
            setNoteName('off');
        }
    }

    function handleStartPlaying() {
        if (currentGamePhase === 'Playing') return; // leave

        if (difficulty === 'hard') {
            setNoteName('off');
        }

        setCountdownTimer(3);
        setCountdownStarted(true);
        const interval = setInterval(() => {
            setCountdownTimer(c => {
                if (c <= 1) {
                    clearInterval(interval);
                    setCurrentGamePhase('Playing');

                    setTimerRunning(true);
                    startTimerRef.current = Date.now() - roundTimer;

                    setDisabledKeyboard(false);
                    setCountdownStarted(false);
                    setRoundNumber(1);
                    setNoteCounter(0);
                    setResults([]);
                    setTimerList([]);

                    const newOrder = generateRoundOrder();
                    setRoundOrder(newOrder);
                    setCurrentScaleSelected(newOrder[0]);
                    return 0;
                }

                return c - 1;
            })
        }, 1000)
    }

    function formatRoundTime(): string {
        let minutes = Math.floor((roundTimer % 3600000) / 60000);
        let seconds = Math.floor((roundTimer % 60000) / 1000);
        let milliseconds = Math.floor((roundTimer % 1000));

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
    }

    function sumTimerList(): string {
        const totalMs = timerList.reduce((sum, time) => sum + time, 0);

        const minutes = Math.floor((totalMs % 3600000) / 60000);
        const seconds = Math.floor((totalMs % 60000) / 1000);
        const milliseconds = Math.floor((totalMs % 1000));

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
    }

    function formatMs(ms: number): string {
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000));

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
    }

    function scaleFormatting(scale: string): string {
        const root = scale.slice(0, -5);
        if (scale.endsWith('major')) {
            return `${root} Major`;
        }
        return `${root} Minor`;
    }

    function getRating(): string {
        switch (lastRoundScore) {
            case 2:
                return 'Terrible';
            case 3:
                return 'Bad';
            case 4:
                return 'Okay';
            case 5:
                return 'Good';
            case 6:
                return 'Amazing!';
            case 7:
                return 'Excellent!';
            default:
                return '...';
        }
    }

    return (<div className={styles.pageContainer}>
        <div className={styles.titleContainer}>
            <p className={styles.title}>SCALES LEARNING</p>
        </div>

        {currentGamePhase === 'Prep' && (
            <div className={styles.prepContainer}>
                <div className={styles.scaleListContainer}>
                    <p className={styles.scaleDescription}>You have chosen the following scales:</p>

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
                {difficulty === 'easy' && (
                    <div className={styles.optionsContainer}>
                        <div className={styles.option}>
                            <label>Note names</label>
                            <select
                                value={noteName}
                                onChange={e => handleNameShow(e.target.value as NoteNameState)}
                            >
                                <option value='on'>ON</option>
                                <option value='off'>OFF</option>
                            </select></div>
                    </div>)}

                <div className={styles.beginContainer}>
                    <p className={styles.scaleDescription}>Are you ready to begin? Timer begins on start of game.</p>
                    <button onClick={handleStartPlaying} className={styles.linkButton}>READY</button>
                    {countdownStarted && <p>STARTING IN {countdownTimer}</p>}
                </div>
            </div>
        )}

        {currentGamePhase === 'Playing' && (
            <>
                <div className={styles.roundInfo}>
                    <span className={styles.underline}>ROUND:</span><span className={styles.roundInfoNumber}>{roundNumber}</span>
                </div>

                <div className={styles.currentScale}>
                    <span className={styles.currentScaleName}>{currentScaleSelected.scale} {currentScaleSelected.scaleType == 'major' ? 'Major' : 'Minor'}</span>
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

                <div className={styles.timerAndResult}>
                    <div className={styles.timerContainer}>
                        <div className={styles.timer}>
                            <span>TIME:</span>
                            <span className={
                                timeComparison === 'faster' ? styles.timerFaster : timeComparison === 'slower' ? styles.timerSlower : ''
                            }>
                                {formatRoundTime()}</span></div>
                        <div className={styles.timer}><span>TOTAL:</span><span>{sumTimerList()}</span></div>
                    </div>
                    <div className={styles.resultWindow}>
                        {roundComplete && (
                            <span className={styles.resultWindowRating}>{getRating()}</span>
                        )}
                    </div>
                </div>

                {/* hard mode users dont get the privilage of note names LOL */}
                {difficulty === 'easy' && (
                    <div className={styles.optionsContainer}>
                        <div className={styles.option}>
                            <label>Note names</label>
                            <select
                                value={noteName}
                                onChange={e => handleNameShow(e.target.value as NoteNameState)}
                            >
                                <option value='on'>ON</option>
                                <option value='off'>OFF</option>
                            </select></div>
                    </div>)}
            </>
        )}

        {currentGamePhase === 'Results' && (
            <>
                <p className={styles.evalInfo}>EVALUATION</p>
                <p>Mode: <span className={styles.underline}>{difficulty === 'easy' ? 'Easy' : 'HARD'}</span></p>
                <div className={styles.evalResults}>
                    <div className={styles.timer}>
                        <span>Time:</span><span>{sumTimerList()}</span>
                    </div>

                    <div className={styles.timer}>
                        <span>Score</span><span>{`${totalScore}/${maxScore} (${percentage}%)`}</span>
                    </div>
                </div>

                <p>Try again?</p>
                <button onClick={handleStartPlaying} className={styles.linkButton}>READY</button>
                {countdownStarted && (
                    <p>STARTING IN {countdownTimer}</p>
                )}

                <button onClick={() => setExpandResults(!expandResults)} className={styles.expandLink}>Expand results</button>

                {expandResults === true && (
                    <div className={styles.table}>
                        <p className={styles.underline}>Additional info</p>

                        <table className={styles.resultsTable}>
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Round</th>
                                    <th style={{ width: '140px' }}>Scale</th>
                                    <th>Correct</th>
                                    <th>Player</th>
                                    <th style={{ width: '90px' }}>Score</th>
                                    <th style={{ width: '120px' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((round, index) => (
                                    <tr key={index}>
                                        <td className={styles.tIndex}>{index + 1}</td>
                                        <td>{round.scale.scale} {round.scale.scaleType}</td>
                                        <td>
                                            <div className={styles.notesWrapper}>
                                                {round.expected.map((note, i) => {
                                                    const missingNote = round.pressed.includes(note);

                                                    return (
                                                        <span
                                                            key={`${note}-${i}`}
                                                            className={`${styles.noteItem} ${!missingNote ? styles.missingNote : ' '
                                                                }`}
                                                        >
                                                            {note}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.notesWrapper}>
                                                {round.pressed.map((note, i) => {
                                                    const isCorrect = round.expected.includes(note);

                                                    return (
                                                        <span
                                                            key={`${note}-${i}`}
                                                            className={`${styles.noteItem} ${isCorrect ? styles.correctNote : styles.incorrectNote
                                                                }`}
                                                        >
                                                            {note}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td>{round.correctCount}/{round.expected.length}</td>
                                        <td>{formatMs(timerList[index] ?? 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        )}

        <Link to="/scales" className={styles.link}>BACK</Link>
    </div>);
}

export default ScalesPractice