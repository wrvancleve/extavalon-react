import React from 'react';

import styles from './FutureInputButton.module.scss';

export default function FutureInputButton({onClick, disabled, text}) {
    return (
        <>
            {disabled
                ?
                    <input className={`${styles.FutureButton} ${styles.FutureButtonDisabled}`} type="submit" onClick={onClick} value={text} disabled/>
                :
                    <input className={styles.FutureButton} type="submit" onClick={onClick} value={text}/>
            }
        </>
    )
}
