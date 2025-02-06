import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Upload, Users } from 'lucide-react';
import axios from 'axios';
import NotConnectedMessage from '../components/NotConnectedMessage';
import StatCard from '../components/StatCard';

const AdminPage = () => {
  const { verifyToken, token } = useUserContext();
  const [stats, setStats] = useState({
    totalFiles: 0,
    todayFiles: 0,
    filesPerUser: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/stats', {
          headers: {
            Authorization: token
          }
        });
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (!verifyToken()) {
    return <NotConnectedMessage />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total files"
          value={stats.totalFiles}
          icon={FileText}
        />
        <StatCard 
          title="Files Today" 
          value={stats.todayFiles}
          icon={Upload}
        />
        <StatCard 
          title="Number of Users" 
          value={stats.filesPerUser.length}
          icon={Users}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Files distribution by user
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.filesPerUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="files" fill="#3B82F6" name="Number of files" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;