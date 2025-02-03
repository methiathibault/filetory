import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { useUserContext } from '../context/AuthContext';
import NotConnectedMessage from '../components/NotConnectedMessage';

const FilesPage = () => {
  const { verifyToken } = useUserContext();

  if (!verifyToken()) {
    return <NotConnectedMessage />;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-2xl font-bold">Mes Fichiers</h1>
      <FileUpload />
      <FileList />
    </div>
  );
};

export default FilesPage;