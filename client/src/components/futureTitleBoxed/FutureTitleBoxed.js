import React from 'react';
import styles from './FutureTitleBoxed.module.scss';

export default function FutureTitleBoxed({link}) {
    return (
        <>
            {link
                ?
                    <h1 className={styles.FutureTitleBoxed}><a class={styles.FutureLink} href={link}>extavalon</a></h1>
                :
                    <h1 className={styles.FutureTitleBoxed}>extavalon</h1>
            }
        </>
    )
}
