import React from 'react';

import '../../styles/common.css'; 

interface CardProps {
    style?: object,
    className?: string,
    children: React.Component | React.FC | JSX.Element | string
}

const Card = (props: CardProps): JSX.Element => {

    return (
        <div 
            className={"card " + props.className}
            style={props.style}
        >


            {props.children}
        </div>
    )

};

export default Card;