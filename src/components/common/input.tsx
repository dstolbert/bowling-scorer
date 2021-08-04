import React from 'react';

interface InputProps {
    value: string,
    onChange: (e: { target: HTMLInputElement }) => any,
    style?: object,
    className?: string,
    type?: string
}

const Input = (props: InputProps): JSX.Element => {

    return (
        <input 
            value={props.value} 
            onChange={props.onChange} 
            type={props.type? props.type: "number"}
            style={props.style} 
            className={props.className}
        />
    )

};

export default Input;