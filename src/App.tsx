import './App.css'
import styles from './App.module.css'
import { Routes, Route, Link } from 'react-router-dom'
import FreePlay from './FreePlay'
import ScalesMenu from './Scales/ScalesMenu'
import ScalesLearning from './Scales/ScalesLearning'
import ScalesPractice from './Scales/ScalesPractice'
import ChordsMenu from './Chords/ChordsMenu'
import ChordsLearning from './Chords/ChrodsLearning'
import ChordsPractice from './Chords/ChordsPractice'
import './themes.css'

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className={styles.container}>
                        <div className={styles.container}>
                            <h1 className={styles.title}>KLAVIER</h1>
                            <p className={styles.underTitle}>Choose your preferred mode</p>
                        </div>

                        <div className={styles.gamesContainer}>
                            <p>
                                <Link to="/free-play" className={styles.link}>Free Play</Link>
                            </p>
                            <p>
                                <Link to="/scales" className={styles.link}>Scales</Link>
                            </p>
                        </div>
                        {/* x.y.z -> x => new game mode, y => overhaul or update of existing game mode, z => small tweaks, bug fixes, etc*/}
                        <div className={styles.info}>MMXXVI - Ver 1.0.1 - <a href='https://github.com/AX-16' target='_blank' className={styles.linkGit}>Nik</a></div>
                    </div>
                }
            />

            <Route path="/free-play" element={<FreePlay />} />
            <Route path="/scales" element={<ScalesMenu />} />
            <Route path="/scales/learn" element={<ScalesLearning />} />
            <Route path="/scales/practice" element={<ScalesPractice />} />
            <Route path="/chords" element={<ChordsMenu />}/>
            <Route path="/chords/learn" element={<ChordsLearning/>} />
            <Route path="/chords/practice" element={<ChordsPractice/>} />
        </Routes>
    )
}

export default App
