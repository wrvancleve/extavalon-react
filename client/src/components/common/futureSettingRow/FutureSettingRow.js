import React from 'react';

import FutureSwitch from '../futureSwitch/FutureSwitch';

export default function FutureSettingRow({name, text, checked, handleSettingClick}) {
    return (
        <div className="CenterFlexRow">
            <label className="FutureLabel">{text}</label>
            <FutureSwitch name={name} checked={checked} handleSettingClick={handleSettingClick} />
        </div>
    )
}
