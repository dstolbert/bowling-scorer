import React from 'react';

// Internal components
import Button from './common/button';
import Title from './common/title';
import Input from './common/input';
import Card from './common/card';
import Frame from './frame';

// Styles
import '../styles/screen.css';

// Types
import { Global } from '../global/global';

// Utils
import { parseFrames } from '../utils/bowling';

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
        dispatch({ type: "add", score: parseInt(newScore) });
    };

    // Compute frames, activeFrame, and pins remaining fresh during each render
    const { frames, activeFrame, pinsRemaining, total } = parseFrames(state.game);

    return (

        <div className="screen">
            <div className="screen-content">

                <Title className="screen-title">Bowling Buddy</Title>

                {/* Bowling card */}
                <Card className="screen-body">

                    <div className="screen-body-content">

                        {/* Frames */}
                        <div className="screen-game-board">
                            {frames.map((f,i) => 
                                <div key={i} style={{flexGrow: i === 9? 2: 1}}>
                                    
                                    {/* Frame number */}
                                    <p className={i === activeFrame? "screen-body-title": ""}>{i+1}</p>

                                    {/* Frame component */}
                                    <Frame frameScore={f.frameScore} scores={f.scores} frameIndex={i} key={i}/>

                                </div>
                            )}
                        </div>

                        {/* Add Score */}
                        <div className="screen-scores">

                            <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                                <p style={{marginRight: 10}} className="screen-body-title">{"Score"}</p>
                                <p>{total.toString()}</p>
                            </div>
                            

                            <div style={{display: "flex"}}>
                                <p className="screen-body-title" style={{
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
                                >
                                    New Game
                            </Button>

                            <Button 
                                onClick={addScore} 
                                style={{marginBottom: 20, width: '100px', height: '30px'}} 
                                >
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