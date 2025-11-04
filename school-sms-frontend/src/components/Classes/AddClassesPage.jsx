import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/api';
import '../../style/Classes.css';

const AddClassPage = () => {
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddClass = async () => {
        if (!className.trim()) {
            setError('⚠️ Please enter class name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Gọi API POST /classes/ (chỉ gửi name)
            const response = await apiClient.post('/classes/', {
                name: className,
            });

            console.log('✅ Class created:', response.data);
            alert('🎉 Class created successfully!');
            navigate('/classes'); // Quay lại danh sách lớp
        } catch (err) {
            console.error('❌ Error creating class:', err.response || err);
            setError(
                err.response?.data?.detail ||
                'Failed to create class. Please check server or network.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content add-class-page">
            <div className="form-card">
                <h2>Add New Class</h2>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div className="form-group">
                    <label>Class Name</label>
                    <input
                        type="text"
                        placeholder="Enter class name"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                </div>

                <button
                    className="button-teal full-width"
                    onClick={handleAddClass}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Class'}
                </button>
            </div>
        </div>
    );
};

export default AddClassPage;
