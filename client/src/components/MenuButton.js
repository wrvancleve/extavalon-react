import React from 'react';

export default function MenuButton({className, onClick, disabled, text}) {
    return (
        <>
            {disabled
                ?
                    <button className={className} onClick={onClick} disabled>{text}</button>
                :
                    <button className={className} onClick={onClick}>{text}</button>
            }
        </>
    )
}
