import {React ,useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function SubscribePage() {

  const [newMail, setNewMail] = useState("");
  const [newPassword, setNewPassword] = useState("");


  let navigate = useNavigate();
  
  const go_subscribe =() => {
      navigate("/login")
  }

  const subscribe = () => {
    axios.post('http://127.0.0.1:3001/users/', {
      email: newMail,
      password: newPassword
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  return (
    <div>
            <div className='font-bold text-2xl'>SubscribePage</div>
            <div>
                email :
                <input onChange={e => setNewMail(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div>
                password :
                <input onChange={e => setNewPassword(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div className=''>
                <button onClick={subscribe} className='rounded-xl border-2 border-black px-4'>subscribe</button>
                <button onClick={go_subscribe} className='rounded-xl border-2 border-black px-4'>have an account ? login</button>
            </div>
        </div>
  )
}
