import React, { useContext, useState, createContext, useEffect } from 'react';
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import NotConnectedMessage from '../components/NotConnectedMessage';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, FileText, Trash2, Save } from 'lucide-react';

export default function Account() {
    const [usersList, setUsersList] = useState({});
    const [facureList, setFactureList] = useState([]);
    const { token, verifyToken, tokenDisconnect,checkToken } = useUserContext();
    
    let navigate = useNavigate();

    useEffect(()=>{
      
        if(!token){
            checkToken()
        }
        if(!token){
           return(
            <NotConnectedMessage/>
           )
        }
        getUser()
        getMaFactures()
        
    },[]);

    const getUser = () => {
        const decodedToken = jwtDecode(token);
        axios.get("http://127.0.0.1:3001/users/"+decodedToken.userId,
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response)
            {
                setUsersList(response.data[0])
            })
    }

    const getMaFactures = () => {
        const decodedToken = jwtDecode(token);
        axios.get("http://127.0.0.1:3001/factures/user/"+decodedToken.userId,
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response)
            {
                setFactureList(response.data)
            })
    }

    const generatePdf = async (id) => {
        axios.get("http://127.0.0.1:3001/factures/"+id,{
            headers:{
                "authorization":token
            }
        })
        .then(function(response){
            const info = response.data[0]
            try {
                const documentDefinition = {
                    content: [
                    { text: 'Document Généré', style: 'header' },
                    { text: `Date: ${new Date().toLocaleDateString()}`, style: 'subheader' },
                    { text: '\n' },
                    { text: 'Données du serveur:', style: 'subheader' },
                    {text: 'email '+info.email},
                    {text: "date d'achat "+info.dateBill},
                    {text: 'prix a lutinté '+info.unitPrice},
                    {text: 'tva '+info.tva+" %"},
                    {text: 'quantité '+info.quantity},
                    {text: 'prix total '+info.totalPrice},
                    ],
                    styles: {
                    header: {
                        fontSize: 22,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    }
                    }
                };
                const pdfDoc = pdfMake.createPdf(documentDefinition);
                pdfDoc.download('document.pdf');
            } 
            catch (error) 
            {
                console.error('Erreur lors de la génération du PDF:', error);
                alert('Erreur lors de la génération du PDF');
            }
        })
    }

    const deleteAccount = () => {
        const decodedToken = jwtDecode(token);

        axios.delete("http://127.0.0.1:3001/users/"+decodedToken.userId,
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response) {
            tokenDisconnect();
            navigate("/");
        })
    }

    const changeUserInfo = (event) => {
        if (event.key === "Enter") {
            axios.put("http://127.0.0.1:3001/users/",
                usersList,
                {
                    headers:{
                        "authorization":token
                    }
                }
            )
            .then(function(response) {
                console.log("info "+response)
            })
        }
    }

    return (
        <>
        {verifyToken() ? 
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center">
                    <User className="w-8 h-8 mr-3" />
                    Account Dashboard
                </h1>

                {/* User Information Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setUsersList({...usersList, email: e.target.value})}
                                    onKeyDown={changeUserInfo}
                                    defaultValue={usersList.email}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setUsersList({...usersList, postalAdress: e.target.value})}
                                    onKeyDown={changeUserInfo}
                                    defaultValue={usersList.postalAdress}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setUsersList({...usersList, name: e.target.value})}
                                    onKeyDown={changeUserInfo}
                                    defaultValue={usersList.name}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setUsersList({...usersList, familyName: e.target.value})}
                                    onKeyDown={changeUserInfo}
                                    defaultValue={usersList.familyName}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Press Enter to save changes for each field
                        </p>
                    </div>
                </div>

                {/* Invoices Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Purchase History
                    </h2>
                    <div className="bg-gray-50 rounded-lg shadow-sm">
                        {facureList.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {facureList.map(result => (
                                    <div key={result.id} 
                                         className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors">
                                        <span className="text-gray-700">
                                            {new Date(result.dateBill).toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={() => generatePdf(result.id)}
                                            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Invoice
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-6 text-gray-500">No purchase history available</p>
                        )}
                    </div>
                </div>

                {/* Delete Account Section */}
                <div className="border-t pt-6">
                    <button
                        onClick={deleteAccount}
                        className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
        : <NotConnectedMessage/>}
        </>
    );
}