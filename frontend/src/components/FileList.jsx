import { useState, useEffect } from 'react';
import { Trash2, Download, Search } from 'lucide-react';
import axios from 'axios';
import { useUserContext } from '../context/AuthContext';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('');
  const { token } = useUserContext();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/files', {
        headers: {
          Authorization: token
        }
      });
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3001/files/${fileId}`, {
        headers: {
          Authorization: token
        }
      });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:3001/files/${fileId}/download`, {
        headers: {
          Authorization: token
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const filteredFiles = files
    .filter(file => 
      file.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterType || file.type === filterType)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      } else {
        return b.size - a.size;
      }
    });

  return (
    <div className="w-full max-w-4xl p-4">
      <div className="mb-4 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un fichier..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Trier par date</option>
          <option value="size">Trier par taille</option>
        </select>
        <select
          className="border rounded-lg px-4 py-2"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="other">Autres</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex-1">
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(file.uploadDate).toLocaleDateString()} - {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(file.id, file.name)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="p-2 hover:bg-red-100 rounded-full text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;