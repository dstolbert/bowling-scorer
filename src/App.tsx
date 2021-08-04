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
    scores: [],
    isComplete: false,
    activeFrame: 0,
    pinsRemaining: 10
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
        scores: [],
        isComplete: false,
        activeFrame: 0,
        pinsRemaining: 10
      }
      
      // Ensure we can legally add the score and check if the game is over
      let frame = {
        index: 0,  // frame index (0 -> 9)
        score: 0, // aggregated score on the frame
        maxScore: 10, // maximum possible score (pins) on this frame
        n: 0, // current number of scores (attempts) on this frame
        maxN: 2, // possible number of scores (attempts) on this frame
      };
      for (let i=0; i<state.game.scores.length + 1; i++) {

        const currScore = state.game.scores[i] ?? action.score;

        // Can the score fit on this frame?
        if (frame.score + currScore < frame.maxScore && frame.n + 1 <= frame.maxN) {

          // Update current frame
          frame.score += currScore;
          frame.n++;

          // If we are on the 10th frame and just scored a spare/strike, update frame
          if (frame.index === 9 && frame.score >= 10) {

            frame.maxScore = 30;
            frame.maxN = 3;

          }

          // Update the game. Note: this can allow for > 10 remaining pins in 
          // the 10th frame, but it's handled by the input :)
          newGame.scores.push(currScore);
          newGame.pinsRemaining = frame.maxScore - currScore;

        }

        else if (frame.index+1 < 10) {

          // Move the score onto the next frame
          frame = {
            index: frame.index++,
            score: currScore,
            maxScore: 10,
            n: 1,
            maxN: 2
          }

          // Update the game. Note: this can allow for > 10 remaining pins in 
          // the 10th frame, but it's handled by the input :)
          newGame.scores.push(currScore);
          newGame.pinsRemaining = frame.maxScore - currScore;
          newGame.activeFrame = frame.index;

        }

      }

      // Finally, check if the game is complete!
      if (frame.index >= 9 && frame.n >= frame.maxN)
        newGame.isComplete = true;

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
