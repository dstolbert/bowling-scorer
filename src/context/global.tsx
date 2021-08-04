import React from 'react';

// Create global app context
export const GlobalContext = React.createContext({});

// Encapsulate global types
export declare namespace Global {

    interface Frame {

        // Cache the current score up to and including this frame in the game
        // null will be used to represent frames that we cannot compute a final
        // score for yet (i.e. no scores or we are waiting for a strike/split)
        frameScore: number | null,

        // An array of int representing the bowl attempts.
        // This should usually be max of length 2, excepct frame 10 where it can 
        // be up to length 3
        scores: Array<number>
    }

    interface Game {

        name: string,
        frames: Array<Frame>

    }

    // Just an added layer of abstraction around the Game so we can add anything
    // extra if needed
    interface State {

        game: Game,


    }
}