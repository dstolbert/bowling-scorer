import React from 'react';

// Components
import Screen from './components/screen';

// Styles
import './styles/App.css';

// Create global data store and reducer
import { Global, GlobalContext } from './context/global';


// Initialize global state
const initialState: Global.State = {

  // Init game
  game: {
    name: "Earl Roderick Anthony",
    frames: Array.from(new Array(10),(val,index) => ({
      frameScore: null,
      scores: []
     }))
  }

}

// Create reducer

function App() {

  // TODO: Init state/reducer

  return (
    <div className="App">
       
      <Screen />


    </div>
  );
}

export default App;
