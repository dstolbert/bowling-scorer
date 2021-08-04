import React from 'react';

// Components
import Screen from './components/screen';

// Styles
import './styles/App.css';

// Import Global namespace and context
import { Global } from './global/global';

// Utils
import { addScoreToGame } from './utils/bowling';

// Initialize global state, wrap in a function to get a fresh copy each time :)
const getInitialState = (): Global.State => ({

  // Init game
  game: {
    name: "Earl Roderick Anthony",
    scores: [],
    isComplete: false
  }

});

// Create reducer
const reducer = (state: Global.State, action: Global.Action): Global.State => {

  switch (action.type) {

    case "add":

      // Don't add if the game is complete!
      if (state.game.isComplete) {
        return state;
      }

      return { game: addScoreToGame(state.game, action.score) };

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
