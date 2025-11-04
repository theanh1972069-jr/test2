import React, { useState, useEffect } from 'react';
import '../../style/StudentEdit.css'; // Dùng lại CSS cũ cho thống nhất

const ClassEdit = ({
    isOpen,
    onClose,
    onSubmit,
    classItem,
    isSubmitting = false,
    submitError = null
}) => {
    const [formData, setFormData] = useState({
        name: ''
    });

    // Khi classItem được truyền vào → điền sẵn dữ liệu
    useEffect(() => {
        if (classItem) {
            setFormData({
                name: classItem.name || ''
            });
        }
    }, [classItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên lớp học!');
            return;
        }

        const payload = {
            name: formData.name.trim()
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="edit-overlay">
            <div className="edit-content">
                <h2>Edit Class</h2>

                <form onSubmit={handleSubmit}>
                    <div className="edit-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="edit-group">
                            <label>Class Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
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

                    <div className="edit-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassEdit;
