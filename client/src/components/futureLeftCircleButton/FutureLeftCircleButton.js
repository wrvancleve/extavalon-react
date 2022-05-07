import React from 'react';
import styles from './FutureLeftCircleButton.module.scss';

export default function FutureLeftCircleButton({onClick, title}) {
    return (
        <button className={styles.FutureLeftCircleButton} onClick={onClick} title={title}> &#8249; </button>
    )
}
