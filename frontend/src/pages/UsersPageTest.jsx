import {React ,useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/AuthContext';
import NotConnectedMessage from '../components/NotConnectedMessage';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default function UsersPageTest() {
    const [usersList, setUsersList] = useState([]);
    const { token, tokenSetter, tokenDisconnect, verifyToken, isConnected } = useUserContext();


    const getUsers = () => {
        console.log("get users");
        axios.get("http://127.0.0.1:3001/users/",
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

    const generatePdf = async () => {
        try {
        const documentDefinition = {
            content: [
              { text: 'Document Généré', style: 'header' },
              { text: `Date: ${new Date().toLocaleDateString()}`, style: 'subheader' },
              { text: '\n' },
              { text: 'Données du serveur:', style: 'subheader' },
              {
                text: 'super test'
              }
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

    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération du PDF');
      }
    
    
    }

    const sendMail = () => {
        console.log("get users");
        axios.get("http://127.0.0.1:3001/users/mail",
        {
            headers:{
                "authorization":token
            }
        })
        .then(function(response)
            {
                console.log(response.data)
                
            })
    }

    useEffect(()=>{
        getUsers()
    },[]);


    return (
        <div>
            <button onClick={generatePdf}>test pdf</button>
            <button onClick={sendMail}>test mail</button>
            
            {verifyToken() ? 
            <>
                <div>UsersPageTest</div>
                <div>
                    <h1>LISTE </h1>
                    {usersList.map(result =>
                    
                        <div key={result.id}>
                            name : {result.email}
                        </div>
                    
                    )}
                </div>
            </>
            : <NotConnectedMessage/>}
            
        </div>
      
    )
  
}
