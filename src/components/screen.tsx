import React from 'react';

// Internal components
import Button from './common/button';
import Title from './common/title';
import Input from './common/input';
import Card from './common/card';
import Frame from './frame'

// Styles
import '../styles/screen.css'

const frames = Array.from(new Array(10),(val,index) => ({
    frameScore: 1*index + 1*index,
    scores: [1*index, 1*index]
}));

const Screen = (): JSX.Element => {

    // Access global state/reducer


    const resetGame = async () => {

    };

    // Handle score changes
    const [newScore, setNewScore] = React.useState<string | null>();

    const onScoreChange = (e: { target: HTMLInputElement }) => {
        const val = parseInt(e.target.value);
        setNewScore(val < 0? "0": val > 10? "10": e.target.value);
    }

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
                                <div style={{flexGrow: i === 9? 2: 1,}}>
                                    {i+1}
                                    <Frame frame={f} frameIndex={i} key={i}/>
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
                                onClick={resetGame} 
                                style={{marginBottom: 20, width: '100px', height: '30px'}} 
                                className="screen-button">
                                    Add Scores
                            </Button>

                        </div>

                    </div>

                </Card>

            </div>
        </div>


    )
};

export default Screen;