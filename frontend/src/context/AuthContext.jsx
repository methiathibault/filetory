import React, { useContext, useState, createContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
export const userContext = createContext();


export function UserProvider({children}){
    const [token, setToken] =  useState(() => localStorage.getItem("token"));

    const [isConnected, setIsConnected] =  useState(false)
    const navigate = useNavigate();
    
    useEffect(()=>{
        checkToken()
    },[]);
    const checkToken = () => {
        const userToken = localStorage.getItem("token");
        console.log("my user token "+ userToken)
        if(userToken){
            setToken(userToken);
        }
    }



    const tokenSetter = (new_token) =>{
        localStorage.setItem("token", new_token);
        setToken(new_token);
    }

    const verifyToken = () =>{
        if(!token){
            return false
        }
        console.log(! !token)
        return ! !token
    }
   
    const tokenDisconnect = () =>{
        localStorage.removeItem("token");
        setToken(null)
    }
    const data = {token, tokenSetter, tokenDisconnect, verifyToken, checkToken, isConnected};
    return <userContext.Provider value={data}>{children}</userContext.Provider>
  }
  export const useUserContext = () => useContext(userContext)