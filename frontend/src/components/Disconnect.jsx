import {React, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/AuthContext';
import axios from 'axios'



export default function Disconnect() {
    let navigate = useNavigate();
    console.log("disconnect")
    const { token, tokenSetter, tokenDisconnect, verifyToken, isConnected } = useUserContext();
    useEffect(()=>{
        tokenDisconnect();
        navigate("/");
    },[])

  return (
    <div>Disconnection</div>
  )
}
