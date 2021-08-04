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

    // Finds the maximal possible bowl given the state of the active frame
    const getActiveFrame = (): {frame: number, score: number} => {

        if (state.game.isComplete)
            return {frame: -1, score: -1};

        // Iterate until we find the last available frame to append a score to
        for (let i=0; i<state.game.frames.length; i++) {

            // Get current frame
            const frame = state.game.frames[i];
    
            // Get total of any existing scores in the frame
            const total = frame.scores.reduce((s,v) => s+v, 0);
    
            // Determine the number of scores available for this frame
            let maxScores = i === 9 && total >= 10? 3: 2;
    
            // If we are here for the first time, we can append the new score
            if (total < 10 && frame.scores.length < maxScores)
                return {frame: i, score: total};
        }

        // If we are here, there is no active frame and the game should be complete!
        return {frame: -1, score: -1};
    }

    // Updates local score input
    const onScoreChange = (e: { target: HTMLInputElement }) => {
        const val = parseInt(e.target.value);
        
        // Get the active frame and the cururent score of the frame
        const { frame, score } = getActiveFrame();

        // Dont allow inputs if there is no active frame
        if (frame >= 0) {
            const maxScore = 10 - score;
            setNewScore(val < 0? maxScore.toString(): val > maxScore? "0": e.target.value);
        }
    }

    // Pushes local score input to game board
    const addScore = () => {
        setNewScore("0");
        dispatch({ type: "add", score: parseInt(newScore, 0) });
    };

    // Finds the scores available at each frame

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
                            {state.game.frames.map((f,i) => 
                                <div key={i} style={{flexGrow: i === 9? 2: 1,}}>
                                    {i+1}
                                    <Frame frameScore={3} frame={f} frameIndex={i} key={i}/>
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