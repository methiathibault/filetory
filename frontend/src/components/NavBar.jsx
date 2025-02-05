import React, {useState} from 'react'
import { Link } from "react-router-dom";
import { useUserContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
export default function NavBar() {
  const { token, verifyToken, checkToken } = useUserContext();
  const [isAdmin, setAdmin] = useState(false)

  const checkAdmin = () => {
    
        const decodedToken = jwtDecode(token);
        

        axios.get("http://127.0.0.1:3001/users/admin/"+decodedToken.userId,
            {
                headers:{
                    "authorization":token
                }
            },
          
        )
        .then(response => {setAdmin(response.data.admin)})
        .catch(error => {
            console.error("Erreur lors de la vérification admin :", error);
            return false; // ou throw error si besoin
        });
    }

  return (
    <div className='flex gap-2 justify-between rounded-full border-2 m-4 p-2 bg-zinc-100'>
        <div className='flex gap-2 mr-4 items-center '>
        <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150  '>  <Link to="/">Home</Link> </div>
          
           
            
        </div>
        <div className='flex gap-2 mr-4 items-center'>
        {verifyToken() ? "":
          <>
            <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '> <Link to="/login">Login</Link></div>
            <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '><Link to="/subscribe">Subscribe</Link></div>
          </>
        }
            
            
            {verifyToken() ?
            <>
              <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '><Link to="/files">My Files</Link> </div>
              <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '> <Link to="/disconnect">Disconnect</Link> </div>
              <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '><Link to="/buy">Buy More Space</Link></div>
              <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '><Link to="/account">Account</Link></div>
             
             
              
              <>{console.log(checkAdmin())}</>

              {isAdmin ?
                <>
                 <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150 '>
                  <Link to="/admin">admin overview</Link>
                 </div>
                  
                </>
                :
                <>
                
                </>
              }

              
              
            </>
            :
            ""
          }
            
        </div>
    </div>
  )
}
