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
    const onScoreChange = (e: { target: HTMLInputElement }) => {
        const val = parseInt(e.target.value);
        
        // Get the active frame and the cururent score of the frame
        const frame = state.game.activeFrame;

        // Dont allow inputs if there is no active frame
        if (frame >= 0) {
            const maxScore = Math.min(10, state.game.pinsRemaining);
            setNewScore(val < 0? maxScore.toString(): val > maxScore? "0": e.target.value);
        }
    }

    // Pushes local score input to game board
    const addScore = () => {
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

    const getFrameScores = (game: Global.Game): Array<FrameData> => {

        let frames: Array<FrameData> = Array.from(new Array(10), (_, i) => ({ 
            frameIndex: i,
            frameScore: 0,
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
            if ((totalPins + newPins > maxScore 
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
            if (frames[activeFrame].scores.length === 2)
                runningTotal += newPins + (game.scores[i+1] ?? 0);

            // Else it must be a strike
            else
                runningTotal += newPins + (game.scores[i+1] ?? 0) + (game.scores[i+2] ?? 0);

            frames[activeFrame].frameScore = runningTotal;

        }

        return frames;
    }

    // Aggregate our scores into frames
    const frames = getFrameScores(state.game);

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
                                    {i+1}
                                    <Frame frameScore={f.frameScore} scores={f.scores} frameIndex={i} key={i}/>
                                </div>
                            )}
                        </div>

                        {/* Add Score */}
                        <div style={{display: 'flex', flexGrow: 1, margin: 20}}>

                            <p className="screen-form-title" style={{
                                width: "100px",
                                paddingRight: 4
                                }}>
                                    Add score
                            </p>

                            <Input style={{width: '40px'}} value={newScore? newScore: ""} onChange={onScoreChange} />

                        </div>

                        {/* Reset / Submit */}
                        <div style={{display: 'flex', width: '100%', justifyContent: 'center', flexGrow: 1}}>
                            <Button 
                                onClick={resetGame} 
                                style={{marginRight: 20, width: '100px', height: '30px'}} 
                                className="screen-button">
                                    Reset
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