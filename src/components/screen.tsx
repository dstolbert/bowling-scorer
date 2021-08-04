import React from 'react';

// Internal components
import Button from './common/button';
import Title from './common/title';
import Input from './common/input';
import Card from './common/card';
import Frame from './frame'

// Styles
import '../styles/screen.css'

// Types
import { Global } from '../global/global'

interface ScreenProps {
    state: Global.State,
    dispatch: React.Dispatch<Global.Action>
}

const Screen = (props: ScreenProps): JSX.Element => {

    // Access global state/reducer
    const { state, dispatch } = props;

    // Hard reset on game
    const resetGame = async () => {
        dispatch({type: "reset"})
    };

    // Handle score changes
    const [newScore, setNewScore] = React.useState<string>("0");

    // Updates local score input
    const onScoreChange = (e: { target: HTMLInputElement }, activeFrame: number, pinsRemaining: number) => {
        const val = parseInt(e.target.value);
        
        // Get the active frame and the cururent score of the frame
        const frame = activeFrame;

        // Dont allow inputs if there is no active frame
        if (frame >= 0) {
            const maxScore = Math.min(10, pinsRemaining);
            setNewScore(val < 0? maxScore.toString(): val > maxScore? "0": e.target.value);
        }
    }

    // Pushes local score input to game board
    const addScore = () => {

        // Don't add if the game is complete!
        if (state.game.isComplete) {
            alert("The game is already complete. Start a new game to continue.");
            return;
        }

        setNewScore("0");
        dispatch({ type: "add", score: parseInt(newScore, 0) });
    };

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

    const parseFrames = (game: Global.Game): 
        {frames: Array<FrameData>, activeFrame: number, pinsRemaining: number, total: number} => {

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

    // Compute frames, activeFrame, and pins remaining fresh during each render
    const { frames, activeFrame, pinsRemaining, total } = parseFrames(state.game);

    return (

        <div className="screen">
            <div className="screen-content">

                <Title className="screen-title">Bowl Master</Title>

                {/* Credentials form */}
                <Card className="screen-form">

                    <div style={{
                        width: '100%', 
                        alignItems: 'center',
                        display: 'flex', 
                        flexDirection: 'column',
                    }}>

                        {/* Frames */}
                        <div style={{
                            flexDirection: 'row',
                            display: 'flex',
                            width: '90%',
                            marginTop: '20px',
                            flexGrow: 1,
                        }}>
                            {frames.map((f,i) => 
                                <div key={i} style={{flexGrow: i === 9? 2: 1,}}>
                                    
                                    {/* Frame number */}
                                    <p className={i === activeFrame? "screen-form-title": ""}>{i+1}</p>

                                    {/* Frame component */}
                                    <Frame frameScore={f.frameScore} scores={f.scores} frameIndex={i} key={i}/>

                                </div>
                            )}
                        </div>

                        {/* Add Score */}
                        <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1, margin: 10}}>

                            <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                                <p style={{marginRight: 10}} className="screen-form-title">{"Score"}</p>
                                <p>{total.toString()}</p>
                            </div>
                            

                            <div style={{display: "flex"}}>
                                <p className="screen-form-title" style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    width: '80px'
                                    }}>
                                        Add pins
                                </p>

                                <Input 
                                    style={{width: '40px'}} 
                                    value={newScore? newScore: ""} 
                                    onChange={(e) => onScoreChange(e, activeFrame, pinsRemaining)} 
                                />
                            </div>

                        </div>

                        {/* Reset / Submit */}
                        <div style={{display: 'flex', width: '100%', justifyContent: 'center', flexGrow: 1}}>
                            <Button 
                                onClick={resetGame} 
                                style={{marginRight: 20, width: '100px', height: '30px'}} 
                                className="screen-button">
                                    New Game
                            </Button>

                            <Button 
                                onClick={addScore} 
                                style={{marginBottom: 20, width: '100px', height: '30px'}} 
                                className="screen-button">
                                    Add Score
                            </Button>

                        </div>

                    </div>

                </Card>

            </div>
        </div>


    )
};

export default Screen;