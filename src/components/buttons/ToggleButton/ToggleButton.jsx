import React, { useImperativeHandle, forwardRef, useState } from "react";
import './ToggleButton.css';

const ToggleButton = (props, ref) => {
    const [checked, setChecked] = useState(false);

    useImperativeHandle(ref, () => {
        return { getIsChecked: () => checked }
    })

    return (
        <label className="switch" >
            <input
                type="checkbox"
                checked={checked} onChange={() => {
                    setChecked(!checked)
                }} 
            />
            <span className="slider round"></span>
        </label>
    )
}

export default forwardRef(ToggleButton);