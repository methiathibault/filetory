import React, { useContext, useState, createContext, useEffect } from 'react';
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import NotConnectedMessage from '../components/NotConnectedMessage';
import { useNavigate } from 'react-router-dom';


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


        const decodedToken = jwtDecode(token);
        console.log(decodedToken)
        
        getUser()
        getMaFactures()
        
    },[]);

    const getUser = () => {
        const decodedToken = jwtDecode(token);
        console.log("get users", token);
        axios.get("http://127.0.0.1:3001/users/"+decodedToken.userId,
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response)
            {
                console.log(response.data)
                setUsersList(response.data[0])
            })
    }
    const getMaFactures = () => {
        
        const decodedToken = jwtDecode(token);
        console.log("get factrure "+token);
        axios.get("http://127.0.0.1:3001/factures/user/"+decodedToken.userId,
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response)
            {
                console.log(response.data)
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
            console.log("response")
            console.log(response.data[0])
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
        console.log("delete acount "+decodedToken.userId)
        console.log("token "+token)

        axios.delete("http://127.0.0.1:3001/users/"+decodedToken.userId,
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response) {
            tokenDisconnect();
            navigate("/");
            console.log("delete acount "+decodedToken.userId)
        })
   }

   const changeUserInfo = (event) =>{

    if (event.key === "Enter") {
        console.log(usersList)

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
    <div className=' rounded-lg  m-4 p-8 bg-stone-100 hover:bg-stone-200 group/menu'>
        <div className='flex justify-center items-center font-bold text-4xl group-hover/menu:underline '>Account</div>
        <div className='flex flex-col items-center m-4'>
            <h1 className='font-bold text-xl'>LISTE INFORMATIONS </h1>
            
                <div key={usersList.id} className='border-2 m-2 p-2 rounded-lg bg-zinc-100 hover:scale-105 hover:bg-zinc-300 duration-150 hover:px-8'>
                     <div className='flex  gap-2 items-center justify-between'> <div>email : </div>  <input type="text" onChange={(e) => setUsersList({...usersList,email:e.target.value})} onKeyDown={changeUserInfo} defaultValue={usersList.email} className='border-2 p-1 rounded-lg border-black hover:px-2 focus:px-4 duration-150 ' /></div>
                     <div className='flex  gap-2 items-center justify-between'> <div>postal code :</div> <input type="text" onChange={(e) => setUsersList({...usersList,postalAdress:e.target.value})} onKeyDown={changeUserInfo} defaultValue={usersList.postalAdress} className='border-2 p-1 rounded-lg border-black hover:px-2 focus:px-4 duration-150 ' /></div>
                     <div className='flex  gap-2 items-center justify-between'><div>name :</div> <input type="text" onChange={(e) => setUsersList({...usersList,name:e.target.value})} onKeyDown={changeUserInfo} defaultValue={usersList.name} className='border-2 p-1 rounded-lg border-black hover:px-2 focus:px-4 duration-150 ' /></div>
                     <div className='flex  gap-2 items-center justify-between'><div>family name :</div> <input type="text" onChange={(e) => setUsersList({...usersList,familyName:e.target.value})} onKeyDown={changeUserInfo} defaultValue={usersList.familyName} className='border-2 p-1 rounded-lg border-black hover:px-2 focus:px-4 duration-150 ' /></div>
                </div>
            
        </div>
        <div className='flex flex-col items-center m-4'>
            <h1 className='font-bold text-xl'>LISTE ACHAT </h1>
            <div className='flex flex-col border-2 rounded-lg bg-zinc-300 hover:px-6 duration-300'>
                {facureList.map(result =>
                    <div className='border-2 m-2 p-2 rounded-lg bg-zinc-100 hover:scale-105 hover:bg-white duration-150 flex gap-2 items-center group'>
                        <div className='group-hover:underline'>{  new Date(result.dateBill).toISOString().split("T")[0]}</div>
                        <button onClick={() =>generatePdf(result.id)} className=' no-underline border-2 bg-blue-100 hover:bg-blue-200 p-2 hover:scale-105 duration-150 rounded-full'> voir facture</button>
                    </div>
                )}
            </div>
        </div>

        <div className='flex flex-col items-center m-4'>
            <button onClick={() => deleteAccount()} className='p-4 bg-red-500 rounded-full hover:bg-red-600 hover:scale-105 duration-150 hover:underline hover:font-bold'>SUPPRIMER MON COMPTE</button>
        </div>
    </div >
     : <NotConnectedMessage/>}
    </>
  )
}
