import React from 'react';
import '../../style/TeacherView.css';

const TeacherView = ({ isOpen, onClose, teacher }) => {
    if (!isOpen || !teacher) return null;

    return (
        <div className="teacher-view-overlay">
            <div className="teacher-view-content">
                <h2>Teacher Information</h2>

                <div className="teacher-view-grid">
                    <div className="teacher-view-group">
                        <label>Full Name</label>
                        <span>{teacher.fullname}</span>
                    </div>

                    <div className="teacher-view-group">
                        <label>First Name</label>
                        <span>{teacher.firstname || '-'}</span>
                    </div>

                    <div className="teacher-view-group">
                        <label>Email</label>
                        <span>{teacher.email}</span>
                    </div>

                    <div className="teacher-view-group">
                        <label>Phone</label>
                        <span>{teacher.phone}</span>
                    </div>

                    <div className="teacher-view-group">
                        <label>Image</label>
                        {teacher.image ? (
                            <img
                                src={teacher.image}
                                alt={teacher.fullname}
                                className="teacher-image-view"
                            />
                        ) : (
                            <span>-</span>
                        )}
                    </div>
                </div>

                <div className="teacher-view-actions">
                    <button className="close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherView;
