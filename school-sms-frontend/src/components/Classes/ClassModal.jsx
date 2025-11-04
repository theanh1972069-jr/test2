import React, { useState } from 'react';
import '../../style/StudentModal.css'; // dùng lại cùng CSS cho đồng bộ

const ClassModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    submitError = null
}) => {
    const [formData, setFormData] = useState({
        name: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            name: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên lớp!');
            return;
        }

        const payload = {
            name: formData.name.trim()
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Class</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="form-group">
                            <label>Class Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter class name"
                            />
                        </div>
                    </div>

                    {submitError && (
                        <p className="error-text">
                            {Array.isArray(submitError)
                                ? submitError.join(', ')
                                : submitError}
                        </p>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Add Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassModal;
