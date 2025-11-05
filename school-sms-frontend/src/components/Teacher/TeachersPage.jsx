import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import TeacherModal from './TeacherModal';
import TeacherEdit from './TeacherEdit';
import TeacherView from './TeacherView';
import '../../style/TeachersPage.css';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/all-teachers/');
      if (!response.data) throw new Error('Không có dữ liệu từ server');
      setTeachers(response.data);
    } catch (err) {
      console.error("Chi tiết lỗi:", {
        message: err.response?.data?.detail || err.message,
        status: err.response?.status
      });
      setError("Không thể tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filtered teachers
  const filteredTeachers = teachers.filter(t =>
    t.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

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

  // Modal handlers
  const openAddModal = () => { setSubmitError(null); setIsAddModalOpen(true); };
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setSubmitError(null);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => { setSelectedTeacher(null); setIsEditModalOpen(false); };

  const openViewModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => { setSelectedTeacher(null); setIsViewModalOpen(false); };

  // CRUD handlers
  const handleAddTeacher = async (teacherData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const response = await apiClient.post('/teachers/', teacherData);
      setTeachers(prev => [...prev, response.data]);
      closeAddModal();
    } catch (err) {
      console.error("Lỗi thêm teacher:", err);
      setSubmitError(err.response?.data?.detail || 'Có lỗi xảy ra');
    } finally { setIsSubmitting(false); }
  };

  const handleEditTeacher = async (teacherData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const response = await apiClient.put(`/teachers/${selectedTeacher.id}/`, teacherData);
      setTeachers(prev => prev.map(t => t.id === selectedTeacher.id ? response.data : t));
      closeEditModal();
    } catch (err) {
      console.error("Lỗi chỉnh sửa teacher:", err);
      setSubmitError(err.response?.data?.detail || 'Có lỗi xảy ra');
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) return;
    try {
      await apiClient.delete(`/teachers/${teacherId}/`);
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
    } catch (err) {
      console.error("Lỗi xóa teacher:", err);
      alert('Xóa không thành công!');
    }
  };

  return (
    <div className="dashboard-content">
      <div className="header-wrapper">
        <div className="title-section">
          <h1 className="centered-title">Manage Teachers</h1>
        </div>
        <div className="controls-section">
          <input
            type="text"
            placeholder="Search By Name"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
          <button className="add-button" onClick={openAddModal}>Add New Teacher</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && currentTeachers.length > 0 && (
        <>
          <table className="teachers-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTeachers.map((teacher, index) => (
                <tr key={teacher.id}>
                  <td>{indexOfFirstTeacher + index + 1}</td>
                  <td>{teacher.fullname}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={() => openViewModal(teacher)}>View</button>
                      <button className="edit-btn" onClick={() => openEditModal(teacher)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>
                    </div>
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

      {!loading && !error && filteredTeachers.length === 0 && <div>No teachers found.</div>}

      {/* Modals */}
      <TeacherModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddTeacher}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      {selectedTeacher && (
        <TeacherEdit
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleEditTeacher}
          teacher={selectedTeacher}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {selectedTeacher && (
        <TeacherView
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          teacher={selectedTeacher}
        />
      )}
    </div>
  );
};

export default TeachersPage;
