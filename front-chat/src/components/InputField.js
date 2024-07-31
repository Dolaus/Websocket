import React from 'react';

function InputField({ label, value, onChange }) {
    return (
        <label>
            {label}:
            <div>
            <input type="text"  value={value} onChange={onChange} />
            </div>
        </label>
    );
}

export default InputField;
