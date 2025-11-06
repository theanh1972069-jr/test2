import React, { useState, useEffect } from 'react';
import '../../style/TeacherEdit.css';

const TeacherEdit = ({
    isOpen,
    onClose,
    onSubmit,
    teacher,
    isSubmitting = false,
    submitError = null
}) => {
    const [formData, setFormData] = useState({
        fullname: '',
        firstname: '',
        email: '',
        phone: ''
    });

    // Khi teacher được truyền vào, điền dữ liệu vào form
    useEffect(() => {
        if (teacher) {
            setFormData({
                fullname: teacher.fullname || '',
                firstname: teacher.firstname || '',
                email: teacher.email || '',
                phone: teacher.phone || ''
            });
        }
    }, [teacher]);

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

        // Kiểm tra dữ liệu bắt buộc
        if (!formData.fullname || !formData.firstname || !formData.email || !formData.phone) {
            alert('Please fill in all required fields.');
            return;
        }

        const payload = {
            fullname: formData.fullname.trim(),
            firstname: formData.firstname.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim()
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="edit-overlay">
            <div className="edit-content">
                <h2>Edit Teacher</h2>

                <form onSubmit={handleSubmit}>
                    <div className="edit-grid">
                        <div className="edit-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="edit-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="edit-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="edit-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {submitError && <p className="error-text">{Array.isArray(submitError) ? submitError.join(', ') : submitError}</p>}

                    <div className="edit-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherEdit;
