import React, { useState, useEffect } from 'react';
import '../../style/StudentEdit.css';

const StudentEdit = ({
    isOpen,
    onClose,
    onSubmit,
    student,
    isSubmitting = false,
    submitError = null
}) => {
    const [formData, setFormData] = useState({
        student_id: '',
        fullname: '',
        firstname: '',
        gender: true,
        date_of_birth: '',
        phone: '',
        guardian: '',
        guardian_phone: '',
        admission_date: ''
    });

    useEffect(() => {
        if (student) {
            setFormData({
                student_id: student.student_id || '',
                fullname: student.fullname || '',
                firstname: student.firstname || '',
                gender: student.gender ?? true,
                date_of_birth: student.date_of_birth || '',
                phone: student.phone || '',
                guardian: student.guardian || '',
                guardian_phone: student.guardian_phone || '',
                admission_date: student.admission_date || ''
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'gender' ? value === 'true' : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Kiểm tra dữ liệu bắt buộc
        if (!formData.student_id || !formData.fullname || !formData.firstname || !formData.date_of_birth || !formData.phone) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        const payload = {
            student_id: formData.student_id.trim(),
            fullname: formData.fullname.trim(),
            firstname: formData.firstname.trim(),
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            phone: formData.phone.trim(),
            guardian: formData.guardian?.trim() || null,
            guardian_phone: formData.guardian_phone?.trim() || null,
            admission_date: formData.admission_date || new Date().toISOString().split('T')[0]
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="edit-overlay">
            <div className="edit-content">
                <h2>Edit Student</h2>

                <form onSubmit={handleSubmit}>
                    <div className="edit-grid">
                        <div className="edit-group">
                            <label>Student ID</label>
                            <input
                                type="text"
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleChange}
                                required
                            />
                        </div>

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
                            <label>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="true">Male</option>
                                <option value="false">Female</option>
                            </select>
                        </div>

                        <div className="edit-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
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

                        <div className="edit-group">
                            <label>Guardian</label>
                            <input
                                type="text"
                                name="guardian"
                                value={formData.guardian}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-group">
                            <label>Guardian Phone</label>
                            <input
                                type="text"
                                name="guardian_phone"
                                value={formData.guardian_phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-group">
                            <label>Admission Date</label>
                            <input
                                type="date"
                                name="admission_date"
                                value={formData.admission_date}
                                onChange={handleChange}
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

export default StudentEdit;
