import React from 'react';

// Internal components
import Card from './common/card';

// Styles
import '../styles/screen.css'

interface FrameProps {
    scores: Array<number>,
    frameIndex: number,
    frameScore: number,
    style?: Object
}

const getFrameScores = (scores: Array<number>, frameIndex: number): Array<string> => {

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

        // If frame has a spare
        if (scores.length > 1 && scores[0] + scores[1] === 10) {

            for (let i=0; i<3; i++) {
                const s = i === 1? "/": scores[i] === undefined? " ": scores[i] === 10? "X": scores[i].toString();
                topRow.push(s);
            }
        }

        // Else we can just replace all 10's with strikes
        else
            for (let i=0; i< (total >= 10? 3: 2); i++)
                topRow.push(scores[i] === undefined? " ": scores[i] === 10? "X": scores[i].toString());
    }

    return topRow;
}

const Frame = (props: FrameProps): JSX.Element => {

    const topRow = getFrameScores(props.scores, props.frameIndex);

    return (

        <Card style={{padding: 4}}>

            <>

            {/* Show the individual scores up top */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: "black",
                borderStyle: "solid"
            }}>
                {topRow.map((s,i) => 
                
                    <div key={i} style={{flexGrow: 1, height: '20px'}}>
                        {s}
                    </div>
                
                )}

            </div>

            {/* Show the total frame score below */}
            <div style={{height: '20px'}}>
                {props.frameScore >= 0? props.frameScore: " "}
            </div>

            </>
        </Card>


    )
};

export default Frame;