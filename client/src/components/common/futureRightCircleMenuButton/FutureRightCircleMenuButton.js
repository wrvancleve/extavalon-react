import React from 'react';

import menuImage from '../../../assets/images/menu.png';
import styles from './FutureRightCircleMenuButton.module.scss';

export default function FutureRightCircleMenuButton({onClick, title}) {
    return (
        <button className={styles.FutureRightCircleMenuButton} onClick={onClick} title={title}>
            <img src={menuImage} alt="Menu" />
        </button>
    )
}
