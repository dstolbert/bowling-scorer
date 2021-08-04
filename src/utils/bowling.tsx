// This file is just an abstracted location to store some of the functioniality
// needed by the React components when working with the game

import { Global } from '../global/global';


// Safely adds a new score to the game
export const addScoreToGame = (game: Global.Game, newScore: number): Global.Game => {

    // Write to a fresh game object
    let newGame: Global.Game = {
        name: game.name,
        scores: [],
        isComplete: false
    };
    
    // Use this frame object to represent the current frame in the game
    let frame = {
        index: 0,  // frame index (0 -> 9)
        score: 0, // aggregated score on the frame
        maxScore: 10, // maximum possible score (pins) on this frame
        n: 0, // current number of scores (attempts) on this frame
        maxN: 2, // possible number of scores (attempts) on this frame
    };

    for (let i=0; i<game.scores.length + 1; i++) {

        const currScore = i < game.scores.length? game.scores[i]: newScore;

        // Can the score fit on this frame?
        if (frame.score < frame.maxScore && 
            frame.score + currScore <= frame.maxScore && 
            frame.n + 1 <= frame.maxN) {

            // Update current frame
            frame.score += currScore;
            frame.n++;

            // If we are on the 10th frame and just scored a spare, update frame
            if (frame.index === 9 && frame.score >= 10) {
            frame.maxScore = 30;
            frame.maxN = 3;
            }

            // Update the game. Note: this can allow for > 10 remaining pins in 
            // the 10th frame, but it's handled by the input :)
            newGame.scores.push(currScore);

        }

        else if (frame.index <= 9) {

            // Move the score onto the next frame
            frame = {
            index: frame.index+1,
            score: currScore,
            maxScore: 10,
            n: 1,
            maxN: 2
            }

            // If we are on the 10th frame and just scored a strike, update frame
            if (frame.index === 9 && frame.score >= 10) {
            frame.maxScore = 30;
            frame.maxN = 3;
            }

            // Update the game. Note: this can allow for > 10 remaining pins in 
            // the 10th frame, but it's handled by the input :)
            newGame.scores.push(currScore);

        }

    }

    // Finally, check if the game is complete!
    if (frame.index >= 9 && frame.n >= frame.maxN)
        newGame.isComplete = true;

    return newGame;
}

// Aggregates raw scores into frame-specific data
interface FrameData {
    frameIndex: number,
    frameScore: number, // aggregated score across frames
    scores: Array<number>,
};

const _getDenseFrameData = (frames: Array<FrameData>, index: number): 
    { totalPins: number, maxN: number, maxScore: number } => {

        // Get current frame data
        const currFrame = frames[index];
        const totalPins = currFrame.scores.reduce((s,v) => s+v, 0);
        const maxN = index === 9 && totalPins > 10? 3: 2;
        const maxScore = maxN === 2? 10: 30;

        return { totalPins, maxN, maxScore }
}

// Converts game scores into the relevant information needed to display the game
export const parseFrames = (game: Global.Game): {
        frames: Array<FrameData>, 
        activeFrame: number, 
        pinsRemaining: number, 
        total: number
    } => {

    let frames: Array<FrameData> = Array.from(new Array(10), (_, i) => ({ 
        frameIndex: i,
        frameScore: -1,
        scores: [] 
    }));

    let activeFrame = 0;
    let runningTotal = 0;
    for (let i=0; i<game.scores.length; i++) {

        // First we will determine which frame this score belongs to
        const newPins = game.scores[i];

        // Get current frame data
        const currFrame = frames[activeFrame];
        let { totalPins, maxN, maxScore } = _getDenseFrameData(frames, activeFrame);

        // Can this score fit in the current active frame?
        if ((totalPins >= maxScore || totalPins + newPins > maxScore 
            || currFrame.scores.length + 1 > maxN) && activeFrame < 9) {
            activeFrame++;
        }

        // Add number of pins to the active frame
        frames[activeFrame].scores.push(newPins);
        ({ totalPins, maxN, maxScore } = _getDenseFrameData(frames, activeFrame));

        // Update running total and frameScore
        // If we are on the last frame, we can just append the number of pins
        if (activeFrame >= 9 || totalPins < 10) {
            runningTotal += newPins;
        }

        // If we have a spare (note that frame 10 cant reach here!)
        else if (frames[activeFrame].scores.length === 2)
            runningTotal += newPins + (game.scores[i+1] ?? 0);

        // Else it must be a strike
        else
            runningTotal += newPins + (game.scores[i+1] ?? 0) + (game.scores[i+2] ?? 0);

        frames[activeFrame].frameScore = runningTotal;

    }

    // Finally, see if the active frame is full and determine the pins remaining
    const { totalPins, maxN, maxScore } = _getDenseFrameData(frames, activeFrame);
    let pinsRemaining = Math.min(10, maxScore - totalPins);
    if (totalPins >= maxScore || frames[activeFrame].scores.length >= maxN) {
        activeFrame++;
        pinsRemaining = 10;
    }

    return { frames, activeFrame, pinsRemaining, total: runningTotal };
}

// Converts the scores in a given frame (pins knocked down) into an array of 
// displayable strings
export const getFrameScores = (scores: Array<number>, frameIndex: number): 
    Array<string> => {

    // Create a parsed array of values to display on top row of frame
    let topRow: Array<string> = []
    const total = scores.reduce((s,v) => s+v, 0);

    // For all non-10th frames
    if (frameIndex < 9) {

        // If strike
        if (total >= 10 && scores.length === 1)
            topRow = ["X"];

        // If spare
        else if (total >= 10 && scores.length > 1)
            topRow = [scores[0].toString(), "/"];

        // Else parse whatever scores we have
        else 
            for (let i=0; i<(frameIndex === 9? 3: 2); i++)
                topRow.push(i <= scores.length - 1? scores[i].toString(): " ");
    }

    // For the 10th frame
    else {

        // If frame has a spare, replace second char with a /
        if (scores.length > 1 && scores[0] < 10 && scores[0] + scores[1] === 10) {
            for (let i=0; i<3; i++) {
                const s = i === 1? "/": scores[i] === undefined? " ": 
                    scores[i] === 10? "X": scores[i].toString();
                topRow.push(s);
            }
        }

        // Else we can just replace all 10's with strikes
        else
            for (let i=0; i< (total >= 10? 3: 2); i++)
                topRow.push(scores[i] === undefined? " ": scores[i] === 10? "X": 
                    scores[i].toString());
    }

    return topRow;
};

