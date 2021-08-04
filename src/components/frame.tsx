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

const Frame = (props: FrameProps): JSX.Element => {

    // Create a parsed array of values to display on top row of frame
    let topRow = []
    const total = props.scores.reduce((s,v) => s+v, 0);

    // If strike
    if (total >= 10 && props.scores.length === 1)
        topRow = ["X"];

    // If spare
    else if (total >= 10 && props.scores.length > 1)
        topRow = ["/"];

    // Else parse whatever scores we have
    else 
        for (let i=0; i<(props.frameIndex === 9? 3: 2); i++)
            topRow.push(i <= props.scores.length - 1? props.scores[i]: " ");

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
                {props.frameScore}
            </div>

            </>
        </Card>


    )
};

export default Frame;