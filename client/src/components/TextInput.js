import React from 'react';

export default function TextInput({className, onChange, placeholder, maxlength, required, text}) {
    return (
        <>
            {required
                ?
                    <input className={className} type="text" onChange={onChange} placeholder={placeholder} maxlength={maxlength} required>{text}</input>
                :
                    <input className={className} type="text" onChange={onChange} placeholder={placeholder} maxlength={maxlength}>{text}</input>
            }
        </>
    )
}
