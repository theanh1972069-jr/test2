import React from 'react';
import '../../style/StudentView.css';

const StudentView = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="student-view-overlay">
            <div className="student-view-content">
                <h2>Student Information</h2>

                <div className="student-view-grid">
                    <div className="student-view-group">
                        <label>Student ID</label>
                        <span>{student.student_id}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Full Name</label>
                        <span>{student.fullname}</span>
                    </div>

                    <div className="student-view-group">
                        <label>First Name</label>
                        <span>{student.firstname}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Gender</label>
                        <span>{student.gender ? 'Male' : 'Female'}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Date of Birth</label>
                        <span>{student.date_of_birth}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Phone</label>
                        <span>{student.phone}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Guardian</label>
                        <span>{student.guardian || '-'}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Guardian Phone</label>
                        <span>{student.guardian_phone || '-'}</span>
                    </div>

                    <div className="student-view-group">
                        <label>Admission Date</label>
                        <span>{student.admission_date}</span>
                    </div>
                </div>

                <div className="student-view-actions">
                    <button className="close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentView;
