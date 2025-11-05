// ClassView.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import '../../style/ClassView.css';

const ClassView = ({ isOpen, onClose, classItem }) => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);

  useEffect(() => {
    if (isOpen && classItem) {
      const fetchStudents = async () => {
        try {
          setLoadingStudents(true);
          setErrorStudents(null);

          const response = await apiClient.get(`/classes/${classItem.id}/students/`);
          setStudents(response.data || []);
        } catch (err) {
          console.error("Failed to load students:", err);
          setErrorStudents("Failed to load students of this class.");
        } finally {
          setLoadingStudents(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [isOpen, classItem]);

  if (!isOpen || !classItem) return null;

  const teacherName = students.length > 0 ? students[0].teacher_name : null;
  const subjectName = students.length > 0 ? students[0].subject_name : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Class Information: {classItem.name}</h2>

        <div className="class-meta-lines">
          <p className="meta-line"><span className="meta-label">Teacher:</span> {teacherName ?? <em>No data</em>}</p>
          <p className="meta-line"><span className="meta-label">Subject:</span> {subjectName ?? <em>No data</em>}</p>
        </div>

        <h3>Student List:</h3>

        {loadingStudents && <p>Loading students...</p>}
        {errorStudents && <p className="error-message">{errorStudents}</p>}

        {!loadingStudents && students.length > 0 ? (
          <table className="students-in-class-table">
            <thead>
              <tr>
                <th>Student Code</th>
                <th>Full Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.student_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loadingStudents && <p>No students in this class.</p>
        )}

        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default ClassView;
