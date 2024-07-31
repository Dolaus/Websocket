import React, {useEffect} from 'react';
import InputField from '../InputField';
import UniversalButton from "../universal-button/UniversalButton";
import './UnsiversalChatModal.css'
function UniversalChatModal({
                                isEditing,
                                initialFirstName,
                                initialLastName,
                                firstName,
                                lastName,
                                setFirstName,
                                setLastName,
                                handleSubmit,
                                closeModal
                            }) {
    useEffect(() => {
        if (isEditing) {
            setFirstName(initialFirstName);
            setLastName(initialLastName);
        } else {
            setFirstName('');
            setLastName('');
        }
    }, [isEditing, initialFirstName, initialLastName, setFirstName, setLastName]);

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 style={{ marginTop: 0}}>{isEditing ? 'Edit Chat' : 'Create New Chat'}</h2>
                <InputField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <InputField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <UniversalButton onClick={closeModal} label="Cancel"/>

                <UniversalButton
                    onClick={handleSubmit}
                    label={isEditing ? 'Save Changes' : 'Create'}
                />
            </div>
        </div>
    );
}

export default UniversalChatModal;
