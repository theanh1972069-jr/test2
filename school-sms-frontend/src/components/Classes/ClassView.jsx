// import React from 'react';
// import '../../style/StudentView.css'; // Dùng lại CSS cũ

// const ClassView = ({ isOpen, onClose, classItem }) => {
//     if (!isOpen || !classItem) return null;

//     return (
//         <div className="student-view-overlay">
//             <div className="student-view-content">
//                 <h2>Class Information</h2>

//                 <div className="student-view-grid">
//                     <div className="student-view-group">
//                         <label>Class ID</label>
//                         <span>{classItem.id}</span>
//                     </div>

//                     <div className="student-view-group">
//                         <label>Class Name</label>
//                         <span>{classItem.name}</span>
//                     </div>
//                 </div>

//                 <div className="student-view-actions">
//                     <button className="close-btn" onClick={onClose}>
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ClassView;
// ClassView.jsx (Cần được tạo hoặc sửa đổi)
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/api';
import '../../style/StudentView.css'; // Dùng lại CSS cũ
// Giả định bạn có một API endpoint để lấy sinh viên theo lớp
// Ví dụ: GET /classes/{class_id}/students/

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
          // *** CHỈNH SỬA ENDPOINT NÀY THEO BACKEND CỦA BẠN ***
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
                {/* Thêm cột khác nếu cần */}
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
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