import React, { useEffect, useState } from 'react';
import '../../style/StudentView.css';
import apiClient from '../../api/api';

const StudentView = ({ isOpen, onClose, student }) => {
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(false);

    useEffect(() => {
        if (isOpen && student) {
            fetchStudentClasses(student.id);
        }
    }, [isOpen, student]);

    const fetchStudentClasses = async (studentId) => {
        try {
            setLoadingClasses(true);
            const response = await apiClient.get(`/students/${studentId}/classes/`);
            setClasses(response.data);
        } catch (err) {
            console.error("Lỗi khi tải lớp của sinh viên:", err);
            setClasses([]);
        } finally {
            setLoadingClasses(false);
        }
    };

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

                {/* --- Student Classes --- */}
                <h2 style={{ marginTop: '30px' }}>Student Classes</h2>
                <div className="student-view-grid">
                    {loadingClasses ? (
                        <div>Loading classes...</div>
                    ) : classes.length === 0 ? (
                        <div>No classes found</div>
                    ) : (
                        classes.map((cls, idx) => (
                            <div key={idx} className="student-view-group">
                                <label>{cls.subject_name}</label>
                                <span>{cls.grade !== null ? cls.grade : '-'}</span>
                            </div>
                        ))
                    )}
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
