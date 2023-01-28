import React from 'react';

import styles from './Error.module.scss';

export default function Error({errors}) {
    return (
        <section className={styles.Errors}>
            {errors.map((error) => {
                return <p>{error}</p>
            })}
        </section>
    )
}
