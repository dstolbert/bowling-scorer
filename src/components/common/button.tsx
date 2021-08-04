import React from 'react';

interface ButtonProps {
    onClick?: (e?: React.SyntheticEvent) => any,
    style?: object,
    className?: string,
    children?: React.Component | React.FC | string
}

const Button = (props: ButtonProps): JSX.Element => {

    return (
        <button onClick={props.onClick} style={props.style} className={props.className}>
            {props.children}
        </button>
    )

};

export default Button;