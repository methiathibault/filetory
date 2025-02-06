import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useUserContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const NavButton = ({ to, children }) => (
  <div className='p-2 rounded-full hover:underline hover:bg-zinc-200 hover:font-bold duration-150'>
    <Link to={to}>{children}</Link>
  </div>
);

export default function NavBar() {
  const { token, verifyToken } = useUserContext();
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      checkAdmin();
    }
  }, [token]);

  const checkAdmin = async () => {
    try {
      const decodedToken = jwtDecode(token);
      const response = await axios.get(
        `http://127.0.0.1:3001/users/admin/${decodedToken.userId}`,
        {
          headers: {
            "authorization": token
          }
        }
      );
      setAdmin(response.data.admin);
    } catch (error) {
      console.error("Erreur lors de la vérification admin :", error);
      setAdmin(false);
    }
  };

  return (
    <nav className='flex gap-2 justify-between rounded-full border-2 m-4 p-2 bg-zinc-100'>
      <div className='flex gap-2 mr-4 items-center'>
        <NavButton to="/">Home</NavButton>
      </div>
      <div className='flex gap-2 mr-4 items-center'>
        {!verifyToken() ? (
          <>
            <NavButton to="/login">Login</NavButton>
            <NavButton to="/subscribe">Register</NavButton>
          </>
        ) : (
          <>
            <NavButton to="/files">Files</NavButton>
            <NavButton to="/account">Account</NavButton>
            <NavButton to="/buy">Buy more space</NavButton>
            {isAdmin && <NavButton to="/admin">Admin dashboard</NavButton>}
            <NavButton to="/disconnect">Disconnect</NavButton>
          </>
        )}
      </div>
    </nav>
  );
}