import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { HardDrive } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

export default function Buy() {
  const { token } = useUserContext();
  const [storageInfo, setStorageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStorageInfo();
  }, []);

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

  const newFacture = async () => {
    try {
      setIsLoading(true);
      const decodedToken = jwtDecode(token);
      
      await axios.post("http://localhost:3001/factures/", 
        {
          userId: decodedToken.userId,
          userEmail: decodedToken.mail,
        },
        {
          headers: {
            "authorization": token
          }
        }
      ).then(function() {
        window.open("https://buy.stripe.com/test_5kA5kSdBbdwg1zieUU", '_blank');
      });
      
      await fetchStorageInfo();
      setIsLoading(false);
    } catch (error) {
      console.error("Error purchasing storage:", error);
      setIsLoading(false);
    }
  }

  const formatStorage = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(1) + ' GB';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-5xl mb-8">Storage space purchase</h1>

          {storageInfo && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <HardDrive size={24} className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Your current storage</h2>
                </div>
                <div className="space-y-2">
                  <p>Used space : {formatStorage(storageInfo.usedStorage)}</p>
                  <p>Total space : {formatStorage(storageInfo.totalStorage)}</p>
                  <p>Available space : {formatStorage(storageInfo.availableStorage)}</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        (storageInfo.usedStorage / storageInfo.totalStorage) > 0.9 
                          ? 'bg-red-600' 
                          : (storageInfo.usedStorage / storageInfo.totalStorage) > 0.7
                          ? 'bg-yellow-400'
                          : 'bg-blue-600'
                      }`}
                      style={{ 
                        width: `${(storageInfo.usedStorage / storageInfo.totalStorage) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="font-bold text-xl">20€ for 20GB additional storage !</div>
            <p className="text-gray-600">Permanently increase your storage space</p>
            <button 
              onClick={newFacture} 
              disabled={isLoading}
              className={`
                bg-blue-500 text-white rounded-full py-3 px-6
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:scale-105'}
                transition-all duration-150
              `}
            >
              {isLoading ? 'Processing...' : 'Buy 20GB for 20€'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}