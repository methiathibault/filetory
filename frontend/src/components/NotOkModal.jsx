import React,{useEffect, useState} from 'react'

export default function NotOkModal({isVisible, onClose, message}) {


    if(!isVisible) return null

   


    useEffect(() => {
      console.log("salut")


        const timer = setTimeout(() => {
          
          console.log('Action exécutée après 2 secondes');
          onClose()
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

  return (
    <div className='fixed inset-0 place-content-end pointer-events-none m-8'>
        <div className='w-[200px] h-[100px] p-6 rounded bg-zinc-200 drop-shadow-xl bg-white border-2 border-red-300 flex justify-center items-center'>
            <div>error</div>
            <div>{message}</div>
        </div>
    </div>
  )
}
