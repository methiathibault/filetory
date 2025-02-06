import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import StorageBar from '../components/StorageBar';
import { useUserContext } from '../context/AuthContext';
import NotConnectedMessage from '../components/NotConnectedMessage';

const FilesPage = () => {
  const { verifyToken } = useUserContext();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUpdateFiles = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!verifyToken()) {
    return <NotConnectedMessage />;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-4">
        <h1 className="text-2xl font-bold">My files</h1>
        <FileUpload onUploadSuccess={handleUpdateFiles} />
        <FileList 
          refreshTrigger={refreshTrigger} 
          onUpdateFiles={handleUpdateFiles}
        />
      </div>
      <StorageBar refreshTrigger={refreshTrigger} />
    </>
  );
};

export default FilesPage;