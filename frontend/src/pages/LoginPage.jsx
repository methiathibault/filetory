import {React ,useState} from 'react'
import axios from 'axios'
import { useUserContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import OkModal from '../components/OkModal';
import NotOkModal from '../components/NotOkModal';


export default function LoginPage() {
    let navigate = useNavigate();

    const [okModal, setOkModal] = useState(false);
    const [notOkModal, setNotOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("")
    const [newMail, setNewMail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { token, tokenSetter, tokenDisconnect, verifyToken, isConnected } = useUserContext();

    const go_subscribe =() => {
        navigate("/subscribe")
    }
    const go_login = () => {
        console.log("go login")
        axios.post('http://127.0.0.1:3001/users/connection', {
            email: newMail,
            password: newPassword
        })
        .then(function (response) {
            console.log("resultat de la connecion"+response.status);
            tokenSetter(response.data);

            setModalMessage("well connected")
            setOkModal(true)
        })
        .catch(function (error) {
            console.log(error);
            setModalMessage("error while connecting")
            setNotOkModal(true)
        });
    }


    return (
        <>
        <div className='rounded-lg flex flex-col bg-stone-100 items-center justify-center group/menu  m-8 gap-2 p-8'>
            <div className='font-bold text-2xl group-hover/menu:underline group-hover/menu:text-4xl duration-150'>LoginPage</div>
           
           <div className='flex flex-col  '>
                <div className=' group/mail'>
                    <div className='group-hover/mail:underline group-hover/mail:font-bold'>Email :</div>
                    <input onChange={e => setNewMail(e.target.value)} className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
                </div>
                <div className='group/pass'>
                    <div className='group-hover/pass:underline group-hover/pass:font-bold duration-300'>Password :</div>
                    <input onChange={e => setNewPassword(e.target.value)} className='rounded-md border-2 border-black px-2 hover:scale-105 focus:scale-110 duration-150'></input>
                </div>
                <div className='flex  justify-around my-4'>
                    <button onClick={() => {go_login()}} className='rounded-full border-2 border-black px-4 bg-blue-100 hover:bg-blue-300 hover:scale-105 duration-150'>Login</button>
                    <button onClick={go_subscribe} className='rounded-full border-2 border-black px-4 bg-cyan-100 hover:bg-cyan-300 hover:scale-105 duration-150'>Subscribe</button>
                </div>
           </div>
           {console.log("mon modal "+okModal)}
           {console.log("mon autre modal "+notOkModal)}
            
        </div>
        <OkModal isVisible={okModal} onClose={() => {setOkModal(false)}} message={modalMessage} />
        <NotOkModal isVisible={notOkModal} onClose={() => {setNotOkModal(false)}} message={modalMessage} />
        </>
    )
}
