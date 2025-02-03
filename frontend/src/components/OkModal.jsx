import React,{useEffect} from 'react'

export default function OkModal({isVisible, onClose, message}) {
  console.log("salut")
  console.log(isVisible)
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
    <div className='fixed inset-0 flex justify-center items-center pointer-events-none'>
        <div className='w-[200px] h-[100px] p-6 rounded bg-zinc-200 drop-shadow-xl bg-white border-2 border-green-300 flex justify-center items-center'>
            <div>ok</div>
            <div>{message}</div>
        </div>
    </div>
  )
}
