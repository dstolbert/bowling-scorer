import React from 'react';

// Components
import Screen from './components/screen';

// Styles
import './styles/App.css';

// Import Global namespace and context
import { Global } from './global/global';

// Initialize global state, wrap in a function to get a fresh copy each time :)
const getInitialState = (): Global.State => ({

  // Init game
  game: {
    name: "Earl Roderick Anthony",
    frames: Array.from(new Array(10),(val,index) => ({
      scores: []
     })),
    isComplete: false
  }

});

// Create reducer
const reducer = (state: Global.State, action: Global.Action): Global.State => {

  switch (action.type) {

    case "add":

      // Don't add if the game is complete!
      if (state.game.isComplete) {
        prompt("The game is already complete. Reset to start a new game.");
        return state;
      }

      // Write to a fresh game object
      let newGame: Global.Game = {
        name: state.game.name,
        frames: [],
        isComplete: false,
      }
      
      // Iterate over all frames until we find the last added score
      let addedScore = false;
      for (let i=0; i<state.game.frames.length; i++) {

        // Get current frame
        let frame = {
          scores: [...state.game.frames[i].scores]
        };

        // Get total of any existing scores in the frame
        const total = frame.scores.reduce((s,v) => s+v, 0);

        // Determine the number of scores available for this frame
        let maxScores = i === 9 && total >= 10? 3: 2;

        // If we are here for the first time, we can append the new score
        if (!addedScore && !(total >= 10 || frame.scores.length >= maxScores)) {
          frame.scores.push(action.score);
          addedScore = true;
        }

        newGame.frames.push(frame);

        // Check if the game is complete
        if (i === 9 && frame.scores.length >= maxScores)
          newGame.isComplete = true;

      }

      return { game: newGame };

    case "reset":
      return getInitialState();

    default:
      return state;

  }

}

function App() {

  // Init state/reducer
  const [ state, dispatch ] = React.useReducer(reducer, getInitialState());

  return (
      <div className="App">
        <Screen state={state} dispatch={dispatch} />
      </div>
  );
}

export default App;
