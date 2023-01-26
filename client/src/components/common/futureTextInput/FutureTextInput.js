import React from 'react';

import styles from './FutureTextInput.module.scss';

export default function FutureTextInput({onChange, placeholder, maxLength, required, text}) {
    return (
        <>
            {required
                ?
                    <input className={styles.FutureInput} type="text" onChange={onChange} placeholder={placeholder} maxLength={maxLength} value={text} required/>
                :
                    <input className={styles.FutureInput} type="text" onChange={onChange} placeholder={placeholder} maxLength={maxLength} value={text}/>
            }
        </>
    )
}
