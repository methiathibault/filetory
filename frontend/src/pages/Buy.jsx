import React from 'react'
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

export default function Buy () {
  const { token, verifyToken, checkToken } = useUserContext();

  const newFacture = () =>{
    const decodedToken = jwtDecode(token);

    console.log(decodedToken)
    axios.post("http://127.0.0.1:3001/factures/", 
    {
      userId:decodedToken.id,
      userEmail: decodedToken.email,
    },
    {
      headers:{
        "authorization":token
      }
    })
    .then(function(response){
      console.log(response)
    })
  }

  return (
    <div>
        <h1>ACHETER DE LESPACE EN PLUS ?</h1>
        <div>20 euro pour 20go a vie (tant que le site ne meurt pas)</div>
        <button onClick={() => newFacture()}>payer 20 euro dollars</button>
    </div>
  )
}
