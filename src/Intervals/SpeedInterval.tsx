import Piano from "../PianoKeyboard/Piano";
import { Link } from "react-router-dom";
import styles from './Interval.module.css'

function SpeedInterval() {
    return (<>
        <p>Welcome to intervals</p>
        
        <Link to="/">Home</Link>
    </>);
}

export default SpeedInterval