import React, { useState } from 'react';
import '../../style/StudentModal.css';

const StudentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitError = null
}) => {
  const [formData, setFormData] = useState({
    student_id: '',
    fullname: '',
    firstname: '',
    gender: true, // boolean
    date_of_birth: '',
    phone: '',
    guardian: '',
    guardian_phone: '',
    admission_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'gender'
          ? value === 'true' // convert string thành boolean
          : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.student_id || !formData.fullname || !formData.firstname || !formData.date_of_birth || !formData.phone) {
      alert('Please fill in all required fields.');
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Student</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender.toString()} // convert boolean sang string
                onChange={handleChange}
              >
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Guardian</label>
              <input
                type="text"
                name="guardian"
                value={formData.guardian}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Guardian Phone</label>
              <input
                type="text"
                name="guardian_phone"
                value={formData.guardian_phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Admission Date</label>
              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
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
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
