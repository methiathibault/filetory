import {React ,useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function SubscribePage() {

  const [newMail, setNewMail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [postalAdress, setPostalAdress] = useState(0);

  let navigate = useNavigate();
  
  const go_subscribe =() => {
      navigate("/login")
  }

  const go_strip_club =() => {
    window.open("https://buy.stripe.com/test_5kA5kSdBbdwg1zieUU", '_blank');
  }

  const subscribe = () => {
    axios.post('http://127.0.0.1:3001/users/', {
      email: newMail,
      password: newPassword,
      name:name,
      familyName:familyName,
      postalAdress:postalAdress
    })
    .then(function (response) {
      console.log(response);
      console.log("calling strip")
      go_strip_club()
      navigate("/")
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className='rounded-lg flex flex-col bg-stone-100 items-center justify-center group/menu  m-8 gap-2 p-8'>
            <div className='font-bold text-2xl group-hover/menu:underline group-hover/menu:text-4xl duration-150'>SubscribePage</div>

            <div className='flex flex-col gap-2'>
              <div className='flex gap-2 justify-between'>
                <div>
                    <div>nom :</div>
                    <input onChange={e => setName(e.target.value)} className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
                </div>
                <div>
                    <div>prenom :</div>
                    <input onChange={e => setFamilyName(e.target.value)} className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
                </div>
              </div>
          
              <div>
                  <div>adresse postale :</div>
                  <input onChange={e => setPostalAdress(e.target.value)} type="number" className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
              </div>
              <div className='flex gap-2 justify-between'>
                <div>
                    <div>email :</div>
                    <input onChange={e => setNewMail(e.target.value)} type='email' className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
                </div>
                <div>
                    <div>password :</div>
                    <input onChange={e => setNewPassword(e.target.value)} type="password" className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
                    <div className='w-40'>password must be at least 12 characters and contains one letter one number and one special character</div>
                </div>
              </div>
              
              <div className=' flex justify-around gap-2'>
                  <button onClick={subscribe} className='rounded-full border-2 border-black px-4 bg-blue-100 hover:bg-blue-300 hover:scale-105 duration-150'>subscribe</button>
                  <button onClick={go_subscribe} className='rounded-full border-2 border-black px-4 bg-cyan-100 hover:bg-cyan-300 hover:scale-105 duration-150'>have an account ? login</button>
              </div>
              </div>
    </div>
  )
}
