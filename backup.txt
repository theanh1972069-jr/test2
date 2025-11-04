import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import '../../style/StudentsPage.css';
import StudentModal from './StudentModal';
import StudentView from './StudentView';
import StudentEdit from './StudentEdit'; // import component edit

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // state xem thông tin
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // state edit
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/students/');
      if (!response.data) throw new Error('Không có dữ liệu từ server');
      setStudents(response.data);
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      setError("Không thể tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm sinh viên
  const handleAddStudent = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const payload = {
        student_id: formData.student_id.trim(),
        fullname: formData.fullname.trim(),
        firstname: formData.firstname.trim(),
        gender: formData.gender === true || formData.gender === 'true',
        date_of_birth: formData.date_of_birth,
        phone: formData.phone.trim(),
        guardian: formData.guardian?.trim() || null,
        guardian_phone: formData.guardian_phone?.trim() || null,
        admission_date: formData.admission_date || new Date().toISOString().split('T')[0],
      };
      await apiClient.post('/students/', payload, { headers: { 'Content-Type': 'application/json' } });
      await fetchStudents();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding student:', err.response?.data || err.message);
      setSubmitError(err.response?.data?.detail || 'Lỗi khi thêm sinh viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cập nhật sinh viên
  const handleUpdateStudent = async (formData) => {
    if (!selectedStudent) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const payload = {
        student_id: formData.student_id.trim(),
        fullname: formData.fullname.trim(),
        firstname: formData.firstname.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        phone: formData.phone.trim(),
        guardian: formData.guardian?.trim() || null,
        guardian_phone: formData.guardian_phone?.trim() || null,
        admission_date: formData.admission_date || new Date().toISOString().split('T')[0],
      };
      await apiClient.put(`/students/${selectedStudent.id}`, payload, { headers: { 'Content-Type': 'application/json' } });
      await fetchStudents();
      setIsEditOpen(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error updating student:', err.response?.data || err.message);
      setSubmitError(err.response?.data?.detail || 'Lỗi khi cập nhật sinh viên');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="header-wrapper">
        <div className="title-section">
          <h1 className="centered-title">Manage Students</h1>
        </div>
        <div className="controls-section">
          <input
            type="text"
            placeholder="Search By Student ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Add New Student
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && students.length > 0 && (
        <table className="students-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>Name</th>
              <th>Guardian</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.fullname}</td>
                <td>{student.guardian}</td>
                <td>{student.phone}</td>
                <td className="actions">
                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsViewOpen(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
                        await apiClient.delete(`/students/${student.id}`);
                        await fetchStudents();
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal thêm sinh viên */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      {/* Modal xem thông tin sinh viên */}
      <StudentView
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        student={selectedStudent}
      />

      {/* Modal chỉnh sửa sinh viên */}
      <StudentEdit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        student={selectedStudent}
        onSubmit={handleUpdateStudent}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
};

export default StudentsPage;
