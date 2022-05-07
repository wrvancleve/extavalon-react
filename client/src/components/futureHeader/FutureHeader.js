import React from 'react';
import styles from './FutureHeader.module.scss';

export default function FutureHeader({headerType, text}) {
    switch (headerType) {
        case "h1":
            return (
                <h1 className={styles.FutureHeader}>{text}</h1>
            );
        case "h2":
            return (
                <h2 className={styles.FutureHeader}>{text}</h2>
            );
        default:
            return (
                <h3 className={styles.FutureHeader}>{text}</h3>
            );
    }
}
