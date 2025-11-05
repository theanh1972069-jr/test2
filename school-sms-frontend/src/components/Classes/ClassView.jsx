// ClassView.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import '../../style/StudentView.css'; // Dùng lại CSS cũ

const ClassView = ({ isOpen, onClose, classItem }) => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);

  // Fetch danh sách sinh viên của lớp
  useEffect(() => {
    if (isOpen && classItem) {
      const fetchStudents = async () => {
        try {
          setLoadingStudents(true);
          setErrorStudents(null);
          // Gọi endpoint lấy danh sách sinh viên theo lớp
          const response = await apiClient.get(`/classes/${classItem.id}/students/`);
          setStudents(response.data);
        } catch (err) {
          console.error("Lỗi tải sinh viên:", err);
          setErrorStudents("Không thể tải danh sách sinh viên của lớp này.");
        } finally {
          setLoadingStudents(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]); // Xóa dữ liệu khi modal đóng
    }
  }, [isOpen, classItem]);

  if (!isOpen || !classItem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Thông tin Lớp học: {classItem.name}</h2>
        {/* Phần hiển thị sinh viên */}
        <h3>Danh sách Sinh viên:</h3>
        {loadingStudents && <p>Đang tải danh sách sinh viên...</p>}
        {errorStudents && <p className="error-message">{errorStudents}</p>}
        {!loadingStudents && students.length > 0 ? (
          <table className="students-in-class-table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ tên</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.student_id}> {/* ✅ Dùng student_id làm key */}
                  <td>{student.student_id}</td>
                  <td>{student.fullname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loadingStudents && <p>Lớp chưa có sinh viên.</p>
        )}
        <button onClick={onClose} className="close-btn">Đóng</button>
      </div>
    </div>
  );
};

export default ClassView;
