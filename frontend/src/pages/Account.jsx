import React, { useContext, useState, createContext, useEffect } from 'react';
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";


export default function Account() {
    const [usersList, setUsersList] = useState([]);
    const [facureList, setFactureList] = useState([]);
    const { token, verifyToken, checkToken } = useUserContext();


    useEffect(()=>{
      
        if(!token){
            checkToken()
            
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
                setUsersList(response.data)
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
   }

  return (
    <>
        <div>Account</div>
        <div>
            <h1>LISTE INFORMATIONS </h1>
            {usersList.map(result =>
                <div key={result.id}>
                     <div> email : {result.email}</div>
                     <div>postal code : {result.postalAdress}</div>
                     <div>name : {result.name}</div>
                     <div>family name : {result.familyName}</div>
                </div>
            )}
        </div>
        <div>
            <h1>LISTE ACHAT </h1>
           {facureList.map(result =>
            <div>
                <div>{result.email} </div>
                <button onClick={() =>generatePdf(result.id)}> voir facture</button>
            </div>
           )}
        </div>
        <div>
            <button onClick={() => deleteAccount()}>SUPPRIMER MON COMPTE</button>
            
        </div>
    </>
    
  )
}
