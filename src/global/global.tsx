import React from 'react';

// Encapsulate global types
export declare namespace Global {

    interface Frame {

        // An array of int representing the bowl attempts.
        // This should usually be max of length 2, excepct frame 10 where it can 
        // be up to length 3
        scores: Array<number>
    }

    interface Game {

        name: string,
        frames: Array<Frame>,
        isComplete: boolean

    }

    // Just an added layer of abstraction around the Game so we can add anything
    // extra if needed
    interface State {

        game: Game,


    }

    // State actions
    type Action =
        | { type: 'add', score: number }
        | { type: 'reset'};

}