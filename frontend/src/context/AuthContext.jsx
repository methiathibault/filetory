import React, { useContext, useState, createContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
export const userContext = createContext();

export function UserProvider({children}){
    const [token, setToken] =  useState(null);
    const [isConnected, setIsConnected] =  useState(false)
    const navigate = useNavigate();
    
    useEffect(()=>{
        const userToken = localStorage.getItem("token");
        setToken(userToken);
    },[]);

    const tokenSetter = (new_token) =>{
        localStorage.setItem("token", new_token);
        setToken(new_token);
    }
    const verifyToken = () =>{
        console.log("token ")
        console.log(! !token)
        return ! !token
    }
    const tokenDisconnect = () =>{
        localStorage.removeItem("token");
        setToken(null)
    }
    const data = {token, tokenSetter, tokenDisconnect, verifyToken, isConnected};
    return <userContext.Provider value={data}>{children}</userContext.Provider>
  }
  export const useUserContext = () => useContext(userContext)