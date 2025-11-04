import React, { useState } from 'react';
import '../../style/TeacherModal.css';

const TeacherModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    submitError = null
}) => {
    const [formData, setFormData] = useState({
        fullname: '',
        firstname: '',
        phone: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.fullname || !formData.firstname || !formData.phone || !formData.email) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        const payload = {
            fullname: formData.fullname.trim(),
            firstname: formData.firstname.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim()
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="teacher-modal-overlay">
            <div className="teacher-modal-content">
                <h2>Add New Teacher</h2>

                <form onSubmit={handleSubmit}>
                    <div className="teacher-form-grid">
                        <div className="teacher-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="teacher-form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="teacher-form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="teacher-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {submitError && (
                        <p className="teacher-error-text">
                            {Array.isArray(submitError)
                                ? submitError.join(', ')
                                : submitError}
                        </p>
                    )}

                    <div className="teacher-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="teacher-cancel-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="teacher-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherModal;
