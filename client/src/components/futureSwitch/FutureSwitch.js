import React from 'react';

import styles from './FutureSwitch.module.scss';

export default function FutureSwitch({name, checked, handleSettingClick}) {
    function handleCheckboxClick(e) {
        handleSettingClick(name, e.target.checked);
    }

    return (
        <>
            {checked
                ?
                    <label className={styles.FutureSwitch}>
                        <input type="checkbox" name={name} onClick={handleCheckboxClick} checked/>
                        <span className={styles.FutureSlider}></span>
                    </label>
                    
                :
                    <label className={styles.FutureSwitch}>
                        <input type="checkbox" name={name} onClick={handleCheckboxClick}/>
                        <span className={styles.FutureSlider}></span>
                    </label>
            }
        </>
    )
}
