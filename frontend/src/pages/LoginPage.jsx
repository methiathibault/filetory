import {React ,useState} from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    let navigate = useNavigate();

      const [newMail, setNewMail] = useState("");
      const [newPassword, setNewPassword] = useState("");

    const go_subscribe =() => {
        navigate("/subscribe")
    }
    const go_login = () => {
        axios.post('http://127.0.0.1:3001/users/connection', {
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
            <div className='font-bold text-2xl'>LoginPage</div>
            <div>
                email :
                <input onChange={e => setNewMail(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div>
                password :
                <input onChange={e => setNewPassword(e.target.value)} className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div className=''>
                <button onClick={go_login} className='rounded-xl border-2 border-black px-4'>login</button>
                <button onClick={go_subscribe} className='rounded-xl border-2 border-black px-4'>subscribe</button>
            </div>
        </div>
    )
}
