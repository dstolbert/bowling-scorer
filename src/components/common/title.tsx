import React from 'react';

import '../../styles/common.css';

interface TitleProps {
    style?: object,
    className?: string,
    children: string
}

const Title = (props: TitleProps): JSX.Element => {

    return (
        <p  className={"title " + props.className}
            style={props.style}
        >
            {props.children}
        
        </p>
    )

};

export default Title;