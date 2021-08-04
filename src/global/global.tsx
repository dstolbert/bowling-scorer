import React from 'react';

// Encapsulate global types
export declare namespace Global {
    interface Game {

        name: string,
        scores: Array<number>,
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