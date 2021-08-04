import React from 'react';

// Internal components
import Card from './common/card';

// Styles
import '../styles/frame.css';

// Utils
import { getFrameScores } from '../utils/bowling';

interface FrameProps {
    scores: Array<number>,
    frameIndex: number,
    frameScore: number,
    style?: Object
}

const Frame = (props: FrameProps): JSX.Element => {

    const topRow = getFrameScores(props.scores, props.frameIndex);

    return (

        <Card style={{padding: 4}}>

            <>

            {/* Show the individual scores up top */}
            <div className="frame-topRow">
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