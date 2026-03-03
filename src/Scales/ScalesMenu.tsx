import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './Scales.module.css'
import './ScalesMain.css'

function ScalesMenu() {
    const nav = useNavigate();

    type Mode = 'learning' | 'training'
    type Difficulty = 'easy' | 'hard'

    const [scaleList, setScaleList] = useState<string[]>([]);
    const [mode, setMode] = useState<Mode>('learning');
    // training
    const [difficulty, setDifficulty] = useState<Difficulty>('easy')
    const [rounds, setRounds] = useState(10);
    const [timerEnabled, setTimerEnabled] = useState(false);

    function handleScaleState(scaleName: string) {
        if (scaleList.includes(scaleName)) {
            setScaleList(s => s.filter(scale => scale !== scaleName));
        } else {
            setScaleList(s => [...s, scaleName]);
        }
    }

    return (
    <div className={styles.page}>
        <div className={styles.titleFlex}>
            <p className={styles.title}>SCALES</p>
            <p className={styles.underTitle}>Select the scales you want to practice</p>
        </div>
        <div className={styles.modeContainer}>
            <div className={styles.modeToggle}>
                <button className={mode === 'learning' ? styles.modeActive : styles.modeInactive} onClick={() => setMode('learning')}>Learning</button>
                <button className={mode === 'training' ? styles.modeActive : styles.modeInactive} onClick={() => setMode('training')}>Training</button>
            </div>

            <div className={styles.scaleContainer}>
                <table>
                    <tbody>
                        <tr>
                            <th className={scaleList.includes("Cmajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Cmajor")}>C Major</th>
                            <th className={scaleList.includes("Cminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Cminor")}>C Minor</th>
                            <th className={scaleList.includes("C#major") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("C#major")}>C# / Db Major</th>
                            <th className={scaleList.includes("C#minor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("C#minor")}>C# / Db Minor</th>
                            <th className={scaleList.includes("Dmajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Dmajor")}>D Major</th>
                            <th className={scaleList.includes("Dminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Dminor")}>D Minor</th>
                        </tr>
                        <tr>
                            <th className={scaleList.includes("D#major") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("D#major")}>D# / Eb Major</th>
                            <th className={scaleList.includes("D#minor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("D#minor")}>D# / Eb Minor</th>
                            <th className={scaleList.includes("Emajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Emajor")}>E Major</th>
                            <th className={scaleList.includes("Eminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Eminor")}>E Minor</th>
                            <th className={scaleList.includes("Fmajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Fmajor")}>F Major</th>
                            <th className={scaleList.includes("Fminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Fminor")}>F Minor</th>
                        </tr>
                        <tr>
                            <th className={scaleList.includes("F#major") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("F#major")}>F# / Gb Major</th>
                            <th className={scaleList.includes("F#minor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("F#minor")}>F# / Gb Minor</th>
                            <th className={scaleList.includes("Gmajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Gmajor")}>G Major</th>
                            <th className={scaleList.includes("Gminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Gminor")}>G Minor</th>
                            <th className={scaleList.includes("G#major") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("G#major")}>G# / Ab Major</th>
                            <th className={scaleList.includes("G#minor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("G#minor")}>G# / Ab Minor</th>
                        </tr>
                        <tr>
                            <th className={scaleList.includes("Amajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Amajor")}>A Major</th>
                            <th className={scaleList.includes("Aminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Aminor")}>A Minor</th>
                            <th className={scaleList.includes("A#major") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("A#major")}>A# / Bb Major</th>
                            <th className={scaleList.includes("A#minor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("A#minor")}>A# / Bb Minor</th>
                            <th className={scaleList.includes("Bmajor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Bmajor")}>B Major</th>
                            <th className={scaleList.includes("Bminor") ? styles.scaleActive : styles.scaleInactive} onClick={() => handleScaleState("Bminor")}>B Minor</th>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.modeSubtext}>
                {mode === 'learning' && (
                    <p className={styles.description}>
                        Choose which scales you would like to learn. More options will be available during practice.
                    </p>
                )}
                {mode === 'training' && (
                    <p className={styles.description}>
                        Train your skills and sharpen your understanding. Easy mode shows mistakes and note names. Hard mode shows no mistakes and no note names.
                    </p>
                )}
            </div>
            <div className={styles.configContainer}>
                {mode === 'training' && (
                    <div className={styles.trainingOptions}>
                        <label className={styles.difficultyOptions}>
                            Difficulty:
                            <select
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value as any)}
                                className={styles.diffSettings}
                            >
                                <option value="easy">Easy (highlight mistakes)</option>
                                <option value="hard">Hard (results at the end)</option>
                            </select>
                        </label>

                        <label className={styles.roundOptions}>
                            Rounds:
                            <input
                                type="number"
                                min={1}
                                value={rounds}
                                onChange={e => setRounds(Number(e.target.value))}
                                className={styles.roundSettings}
                            />
                        </label>
                        {/*
                        <label>
                            <input
                                type="checkbox"
                                checked={timerEnabled}
                                onChange={e => setTimerEnabled(e.target.checked)}
                            />
                            TIME MODE
                        </label>
                        */}
                    </div>
                )
                }   


                <div className={styles.beginContainer}>
                    <p>
                        Chosen {scaleList.length} scales to {mode === 'learning' ? 'practice' : 'train'}.
                    </p>
                    <button className={styles.linkButton} disabled={scaleList.length === 0} onClick={
                        () => {
                            nav(
                                mode === 'learning' ? '/scales/learn' : '/scales/practice',
                                {
                                    state: {
                                        scaleList,
                                        mode,
                                        difficulty,
                                        rounds,
                                        timerEnabled
                                    }
                                }
                            )
                        }
                    }>
                        {mode === 'learning' ? 'Begin learning' : 'Begin training'}
                    </button>
                </div>
            </div>
        </div>


        <Link to="/" className={styles.link}>BACK</Link>
    </div>
    );
}

export default ScalesMenu