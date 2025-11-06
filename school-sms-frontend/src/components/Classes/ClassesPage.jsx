import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import '../../style/ClassesPage.css';
import ClassModal from './ClassModal';
import ClassEdit from './ClassEdit';
import ClassView from './ClassView';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 10;

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classesRes, countsRes] = await Promise.all([
        apiClient.get('/all-classes/'),
        apiClient.get('/class-student-counts')
      ]);

      const classData = classesRes.data;
      const countData = countsRes.data;

      const merged = classData.map(cls => {
        const countInfo = countData.find(c => c.class_id === cls.id);
        return {
          ...cls,
          student_count: countInfo ? countInfo.student_count : 0
        };
      });

      setClasses(merged);
    } catch (err) {
      console.error("Error detail:", err);
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

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

  const handleAddClass = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const payload = { name: formData.name.trim() };
      await apiClient.post('/classes/', payload, { headers: { 'Content-Type': 'application/json' } });
      await fetchClasses();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding class:', err.response?.data || err.message);
      setSubmitError(err.response?.data?.detail || 'Failed to add class');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClass = async (formData) => {
    if (!selectedClass) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const payload = { name: formData.name.trim() };
      await apiClient.put(`/classes/${selectedClass.id}`, payload, { headers: { 'Content-Type': 'application/json' } });
      await fetchClasses();
      setIsEditOpen(false);
      setSelectedClass(null);
    } catch (err) {
      console.error('Error updating class:', err.response?.data || err.message);
      setSubmitError(err.response?.data?.detail || 'Failed to update class');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="header-wrapper">
        <div className="title-section">
          <h1 className="centered-title">Manage Classes</h1>
        </div>
        <div className="controls-section">
          <input
            type="text"
            placeholder="Search By Name"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Add New Class
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && currentClasses.length > 0 && (
        <>
          <table className="classes-table">
            <thead>
              <tr>
                <th>S No</th>
                <th>Class Name</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentClasses.map((cls, index) => (
                <tr key={cls.id}>
                  <td>{indexOfFirstClass + index + 1}</td>
                  <td>{cls.name}</td>
                  <td>{cls.student_count}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedClass(cls);
                        setIsViewOpen(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedClass(cls);
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this class?')) {
                          await apiClient.delete(`/classes/${cls.id}`);
                          await fetchClasses();
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

      {!loading && !error && filteredClasses.length === 0 && <div>No classes found.</div>}

      {/* Modals */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddClass}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <ClassEdit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        classItem={selectedClass}
        onSubmit={handleUpdateClass}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <ClassView
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        classItem={selectedClass}
      />
    </div>
  );
};

export default ClassesPage;
