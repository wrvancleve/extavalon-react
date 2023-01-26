import React from 'react';

import styles from './FutureTitle.module.scss';

export default function FutureTitle({text}) {
    return (
        <h2 className={styles.FutureTitle}>{text}</h2>
    );
}
