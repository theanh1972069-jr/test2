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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/all-students/');
      if (!response.data) throw new Error('No data received');
      setStudents(response.data);
    } catch (err) {
      console.error("Error detail:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Tìm kiếm
  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) pages.push(1, '...');
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) pages.push('...', totalPages);

    return pages;
  };

  const handlePageChange = (page) => {
    if (page === '...') return;
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
      setSubmitError(err.response?.data?.detail || 'Failed to add student');
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
      setSubmitError(err.response?.data?.detail || 'Failed to update student');
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
            placeholder="Search By Name or ID"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Add New Student
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && currentStudents.length > 0 && (
        <>
          <table className="students-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{indexOfFirstStudent + index + 1}</td>
                  <td>{student.student_id}</td>
                  <td>{student.fullname}</td>
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
                        if (window.confirm('Are you sure you want to delete this student?')) {
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

          {/* Pagination */}
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? 'active-page' : ''}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}

      {!loading && !error && filteredStudents.length === 0 && <div>No students found.</div>}

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
