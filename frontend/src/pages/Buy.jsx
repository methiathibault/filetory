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
      userId:decodedToken.userId,
      userEmail: decodedToken.mail,
    },
    {
      headers:{
        "authorization":token
      }
    })
    .then(function(response){
      console.log(response)
      window.open("https://buy.stripe.com/test_5kA5kSdBbdwg1zieUU", '_blank');
    })
  }

  return (
    <div className='flex flex-col justify-center items-center my-8 bg-stone-100 rounded-lg p-4 m-2'>
        <h1 className='font-bold text-5xl'>ACHETER DE L'ESPACE EN PLUS ?</h1>
        <div className='font-bold text-xl' >20 euro pour 20go a vie (tant que le site ne meurt pas)</div>
        <button onClick={() => newFacture()} className='bg-blue-100 rounded-full p-2  hover:bg-blue-200 hover:scale-105 hover:px-4 hover:font-bold duration-150'>payer 20 euro dollars</button>
    </div>
  )
}
