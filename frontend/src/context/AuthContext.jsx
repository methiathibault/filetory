import React, { useContext, useState, createContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
export const userContext = createContext();
import Cookies from 'js-cookie';

export function UserProvider({children}){
    const [token, setToken] =  useState(() => Cookies.get("token"));

    const [isConnected, setIsConnected] =  useState(false)
    const navigate = useNavigate();
    
    useEffect(()=>{
        checkToken()
    },[]);
    const checkToken = () => {
        const userToken = Cookies.get("token");
        if(userToken){
            setToken(userToken);
        }
    }



    const tokenSetter = (new_token) =>{
        Cookies.set("token", new_token,{secure: true, sameSite:"Strict", expires:7})
        setToken(new_token);
    }

    const verifyToken = () =>{
        if(!token){
            return false
        }
        return ! !token
    }
   
    const tokenDisconnect = () =>{
        Cookies.remove("token");
        setToken(null)
    }
    const data = {token, tokenSetter, tokenDisconnect, verifyToken, checkToken, isConnected};
    return <userContext.Provider value={data}>{children}</userContext.Provider>
  }
  export const useUserContext = () => useContext(userContext)