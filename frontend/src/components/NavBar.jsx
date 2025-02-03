import React from 'react'
import { Link } from "react-router-dom";
import { useUserContext } from '../context/AuthContext';

export default function NavBar() {
  const { token, verifyToken, checkToken } = useUserContext();

  return (
    <div className='flex gap-2 justify-between'>
        <div>
            <Link to="/">Home</Link>
            <Link to="/users">all users</Link>
        </div>
        <div className='flex gap-2 mr-4'>
            <Link to="/login">login</Link>
            <Link to="/subscribe">subscribe</Link>
            
            {verifyToken() ?
            <>
            <Link to="/files">my files</Link>
            <Link to="/disconnect">disconnection</Link>
            <Link to="/buy">buy space</Link>
            <Link to="/account">my account</Link>
            </>
            :
            ""
          }
            
        </div>
    </div>
  )
}
