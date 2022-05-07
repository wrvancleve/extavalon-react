import React from 'react';
import styles from './FutureButton.module.scss';

export default function FutureButton({onClick, disabled, text}) {
    return (
        <>
            {disabled
                ?
                    <button className={`${styles.FutureButton} ${styles.FutureButtonDisabled}`} onClick={onClick} disabled>{text}</button>
                :
                    <button className={styles.FutureButton} onClick={onClick}>{text}</button>
            }
        </>
    )
}
