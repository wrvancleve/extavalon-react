import React from 'react';
import styles from './FutureRightCircleMenuButton.module.scss';

export default function FutureRightCircleMenuButton({onClick, title}) {
    return (
        <button className={styles.FutureRightCircleMenuButton} onClick={onClick} title={title}>
            <img src="../../assets/images/menu.png" alt="Menu" />
        </button>
    )
}
