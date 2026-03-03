# Klavier V1.0
An interactive piano training web app built with React, TypeScript and Tone.js.
Includes practice, learning and drilling of various aspects of piano.

## About
Klavier is a browser-based app, designed to help and teach users various piano related skills.

As of V1, the app includes:
- A Free Play mode
	- Where you can interact with a virtual keyboard,
	- Change amount of octaves,
	- See history of pressed keys
- A Scale Learning mode
	- Select any scale from a total of 24,
	- Learn the scale using the interactive virtual keyboard,
	- Mistakes, Correct notes, and which notes to press are all highlighted- 
- And a Scale Practice mode
	- Select any scale from a total of 24,
	- Select the amount of rounds you would like to practice,
	- And select an easy or hard mode, depending on the challenge you would like,
	- Includes a performance evaluation at the end, showing:
		- Incorrect notes pressed,
		- Time taken in each round,
		- Which correct notes were missing

### Stack used
The project mainly consists of:
- React
- TypeScript
- Vite
- Tone.js

## Getting Started
1. Clone repository:
```bash
git clone https://github.com/AX-16/PianoApp.git
cd PianoApp
```
2. Install dependencies
```bash
npm install
```
3. Start development server
```bash
npm run dev
```
4. Access the server
```bash
http://localhost:5173/
```

## Future plans
- A chord learning mode,
- A sheet music learning mode,
- An interval learning mode,
- Multiple themes,
- Progress tracking