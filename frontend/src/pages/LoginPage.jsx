import {React ,useState} from 'react'
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import OkModal from '../components/OkModal';
import NotOkModal from '../components/NotOkModal';

export default function LoginPage() {
    let navigate = useNavigate();
    const [okModal, setOkModal] = useState(false);
    const [notOkModal, setNotOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("")
    const [newMail, setNewMail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { token, tokenSetter, tokenDisconnect, verifyToken, isConnected } = useUserContext();

    const go_subscribe =() => {
        navigate("/files")
    }

    const go_login = () => {
        axios.post('http://127.0.0.1:3001/users/connection', {
            email: newMail,
            password: newPassword
        })
        .then(function (response) {
            tokenSetter(response.data);
            setModalMessage("well connected")
            setOkModal(true)
            navigate("/")
        })
        .catch(function (error) {
            setModalMessage("error while connecting")
            setNotOkModal(true)
        });
    }

    return (
        <>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Login</h2>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                onChange={e => setNewMail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                onChange={e => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between space-x-4">
                        <button
                            onClick={go_login}
                            className="flex items-center justify-center w-1/2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign in
                        </button>

                        <button
                            onClick={go_subscribe}
                            className="flex items-center justify-center w-1/2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <OkModal isVisible={okModal} onClose={() => {setOkModal(false)}} message={modalMessage} />
        <NotOkModal isVisible={notOkModal} onClose={() => {setNotOkModal(false)}} message={modalMessage} />
        </>
    )
}