import React from 'react'

import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    let navigate = useNavigate();

    const go_subscribe =() => {
        navigate("/subscribe")
    }
    const go_login = () => {
        console.log('you are loged in successfully')
        navigate("/files")
    }


    return (
        <div>
            <div className='font-bold text-2xl'>LoginPage</div>
            <div>
                email :
                <input className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div>
                password :
                <input className='rounded-md border-2 border-black px-2'></input>
            </div>
            <div className=''>
                <button onClick={go_login} className='rounded-xl border-2 border-black px-4'>login</button>
                <button onClick={go_subscribe} className='rounded-xl border-2 border-black px-4'>subscribe</button>
            </div>
        </div>
    )
}
