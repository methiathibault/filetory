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
    window.location.href = "https://buy.stripe.com/test_5kA5kSdBbdwg1zieUU";
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
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  return (
    <div>
            <div className='font-bold text-2xl'>SubscribePage</div>
            <div>
                nom :
                <input onChange={e => setName(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div>
                prenom :
                <input onChange={e => setFamilyName(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div>
                adresse postale :
                <input onChange={e => setPostalAdress(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
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
            <div>
              <button onClick={go_strip_club} className='rounded-xl border-2 border-black px-4'>achat 20 go</button>
            </div>
        </div>
  )
}
