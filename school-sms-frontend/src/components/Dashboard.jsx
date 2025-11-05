import { useState, useEffect } from 'react';
import apiClient from '../api/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/dashboard/summary');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error loading Dashboard data:", err.response || err);
        setError("CONNECTION ERROR: Unable to load Dashboard data. Please check FastAPI server.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-content">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-content" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <section className="dashboard-content">
      <h2>Dashboard Overview</h2>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card bg-teal">
          <div className="card-info">
            <h3>Total Students</h3>
            <p>{data?.totalStudents}</p>
          </div>
        </div>

        <div className="overview-card bg-yellow">
          <div className="card-info">
            <h3>Total Teachers</h3>
            <p>{data?.totalTeachers}</p>
          </div>
        </div>

        <div className="overview-card bg-red">
          <div className="card-info">
            <h3>Total Classes</h3>
            <p>{data?.totalClasses}</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Dashboard;
