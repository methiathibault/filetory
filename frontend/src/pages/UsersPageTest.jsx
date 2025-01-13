import {React ,useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/AuthContext';
import NotConnectedMessage from '../components/NotConnectedMessage';

export default function UsersPageTest() {
    const [usersList, setUsersList] = useState([]);
    const { token, tokenSetter, tokenDisconnect, verifyToken, isConnected } = useUserContext();


    const getUsers = () => {
        console.log("get users");
        axios.get("http://127.0.0.1:3001/users/")
            .then(function(response){
                console.log(response.data)
                setUsersList(response.data)
            })
    }

    useEffect(()=>{
        getUsers()
    },[]);


    return (
        <div>
            
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
