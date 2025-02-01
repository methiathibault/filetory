import { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { useUserContext } from '../context/AuthContext';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const { token } = useUserContext();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      await axios.post('http://localhost:3001/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <form
        className={`relative w-full max-w-xl h-64 p-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          multiple
          onChange={handleChange}
        />

        <div className="flex flex-col items-center">
          <Upload size={48} className="text-gray-500 mb-4" />
          <p className="text-gray-600 text-center">
            Glissez-déposez vos fichiers ici<br />ou cliquez pour sélectionner
          </p>
        </div>
      </form>

      {uploadProgress > 0 && (
        <div className="w-full max-w-xl mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">{uploadProgress}% uploadé</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;