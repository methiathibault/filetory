import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/AuthContext';
import { HardDrive } from 'lucide-react';

const StorageBar = ({ refreshTrigger }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useUserContext();

  useEffect(() => {
    fetchStorageInfo();
  }, [refreshTrigger]);

  const fetchStorageInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3001/files/storage', {
        headers: {
          Authorization: token
        }
      });
      setStorageInfo(response.data);
    } catch (error) {
      console.error('Error fetching storage info:', error);
    }
  };

  if (!storageInfo) return null;

  const usagePercentage = (storageInfo.usedStorage / storageInfo.totalStorage) * 100;
  const usedGB = (storageInfo.usedStorage / (1024 * 1024 * 1024)).toFixed(2);
  const totalGB = (storageInfo.totalStorage / (1024 * 1024 * 1024)).toFixed(2);
  const availableGB = ((storageInfo.totalStorage - storageInfo.usedStorage) / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div 
      className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{ maxWidth: isExpanded ? '300px' : '200px', zIndex: 1000 }}
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive size={16} className={`
            ${usagePercentage > 90 ? 'text-red-500' : 
              usagePercentage > 70 ? 'text-yellow-500' : 
              'text-blue-500'}
          `} />
          <span className="text-sm font-medium">
            {usedGB}/{totalGB} GB
          </span>
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full transition-all duration-300 ${
              usagePercentage > 90 ? 'bg-red-500' : 
              usagePercentage > 70 ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>

        {isExpanded && (
          <div className="mt-2 text-xs text-gray-500 transition-all duration-300">
            {availableGB} GB available
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageBar;